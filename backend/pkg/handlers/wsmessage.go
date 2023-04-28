package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	db "socialnetwork/backend/pkg/db/sqlite"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	MESSAGE_TYPE             = "message"
	LOGOUT_TYPE              = "logout"
	LOGIN_TYPE               = "login"
	FOLLOWNOTIFICATION_TYPE  = "follownotification"
	INVITENOTIFICATION_TYPE  = "invitenotification"
	JOINREQNOTIFICATION_TYPE = "joinreqnotification"
	EVENTNOTIFICATION_TYPE   = "eventnotification"
)

var (
	websocketUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true }, //Allow all origins
	}
)

type Manager struct {
	clients ClientList
	sync.RWMutex
}

func NewManager() *Manager {
	return &Manager{
		clients: make(ClientList),
	}
}

func (m *Manager) serveWS(w http.ResponseWriter, r *http.Request) {
	log.Println("new connection")

	userEmail := AuthenticateUser(w, r)

	id := DB.GetUserID(userEmail)

	conn, err := websocketUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := NewClient(conn, m, id)
	m.addClient(client)
	//Send all the notifications to the client
	GroupNotifications, err := DB.GetGroupNotifications(id)
	if err != nil {
		log.Println(err)
		return
	}

	FollowNotifications, err := DB.GetFollowNotifications(id)
	if err != nil {
		log.Println(err)
		return
	}

	//Start client
	go client.readMessages()
	go client.writeMessages()

	if len(GroupNotifications) > 0 {
		for _, n := range GroupNotifications {
			msg := db.Message{
				Type:     JOINREQNOTIFICATION_TYPE,
				From:     n.UserId,
				UserName: n.UserName,
				To:       id,
				Message:  fmt.Sprintf("%s wants to join your group %s", n.UserName, n.GroupName),
			}
			message, _ := json.Marshal(msg)

			//wait 1 second before sending the next message to let the notification component load
			time.Sleep(1 * time.Second)

			client.eggress <- message
		}
	}

	if len(FollowNotifications) > 0 {
		for _, follower := range FollowNotifications {
			msg := db.Message{
				Type:     FOLLOWNOTIFICATION_TYPE,
				From:     0,
				UserName: follower,
				To:       id,
				Message:  fmt.Sprintf("%s wants to follow you", follower),
			}
			message, _ := json.Marshal(msg)

			//wait 1 second before sending the next message to let the notification component load
			time.Sleep(1 * time.Second)

			client.eggress <- message
		}
	}

}

func (m *Manager) addClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	m.clients[client] = true
}

func (m *Manager) removeClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	if _, ok := m.clients[client]; ok {
		client.connection.Close()
		delete(m.clients, client)
	}
}

//Client

type ClientList map[*Client]bool

type Client struct {
	connection *websocket.Conn
	manager    *Manager
	eggress    chan []byte
	userId     int
}

/*var (
	// pongWait is how long we will await a pong response from client
	pongWait = 10 * time.Second
	// pingInterval has to be less than pongWait, We cant multiply by 0.9 to get 90% of time
	// Because that can make decimals, so instead *9 / 10 to get 90%
	// The reason why it has to be less than PingRequency is becuase otherwise it will send a new Ping before getting response
	pingInterval = (pongWait * 9) / 10
)*/

func NewClient(conn *websocket.Conn, manager *Manager, id int) *Client {
	return &Client{
		connection: conn,
		manager:    manager,
		eggress:    make(chan []byte),
		userId:     id,
	}
}

// readMessages will start the client to read messages and handle them
// appropriatly.
// This is suppose to be ran as a goroutine
func (c *Client) readMessages() {
	defer func() {
		// cleanup connection
		c.manager.removeClient(c)
	}()

	// Loop Forever
	for {
		// ReadMessage is used to read the next message in queue
		// in the connection
		_, payload, err := c.connection.ReadMessage()

		if err != nil {
			// If Connection is closed, we will receive an error here
			// We only want to log Strange errors, but simple Disconnection
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error reading message: %v", err)
			}
			break // Break the loop to close conn & Cleanup
		}

		res := db.Message{}

		err = json.Unmarshal([]byte(payload), &res)

		if err != nil {
			log.Printf("error unmarshalling message: %v", err)
			continue
		}

		res.From = c.userId

		res.UserName, err = DB.GetUserName(res.From)
		if err != nil {
			log.Println(err)
		}

		if res.From > 0 {
			res.CreatedAt = DB.GetTime()
			message, _ := json.Marshal(res)
			if res.Type == MESSAGE_TYPE {

				chatUsers, err := DB.GetUserIdsfromChatId(res.To)
				if err != nil {
					log.Println(err)
				}

				for _, chatUser := range chatUsers {
					for wsclient := range c.manager.clients {
						if wsclient.userId == chatUser {
							wsclient.eggress <- message
						}
					}
				}
				//insert chatid, creatorid, message, createdat
				err = DB.AddMessage(res.To, res.From, res.Message, res.CreatedAt)
				if err != nil {
					log.Println(err)
				}

			} else if res.Type == LOGOUT_TYPE {
				for wsclient := range c.manager.clients {
					wsclient.eggress <- payload
				}

			} else if res.Type == LOGIN_TYPE {
				for wsclient := range c.manager.clients {
					if wsclient.userId != res.From {
						message, _ := json.Marshal(res)
						wsclient.eggress <- message
					}
				}
			} else if res.Type == FOLLOWNOTIFICATION_TYPE {
				res.Message = fmt.Sprintf("%s requested to follow you", res.UserName)
				//notify the user that he has a new follower
				for wsclient := range c.manager.clients {
					if wsclient.userId == res.To {
						message, _ := json.Marshal(res)
						wsclient.eggress <- message
					}
				}

			} else if res.Type == INVITENOTIFICATION_TYPE {
				// notify the user that he has a new group invitation
				for wsclient := range c.manager.clients {
					if wsclient.userId == res.To {
						message, _ := json.Marshal(res)
						wsclient.eggress <- message
					}
				}
			} else if res.Type == JOINREQNOTIFICATION_TYPE {
				// notify the creator of the group that he has a new join request
				// get the creator of the group
				creatorId, err := DB.GetGroupCreatorId(res.To) //assuming res.To is group id.
				if err != nil {
					log.Println(err)
				}

				group, err := DB.GetGroup(res.To, c.userId)
				if err != nil {
					log.Println(err)
				}

				res.Message = res.UserName + " wants to join your group " + group.GroupName

				for wsclient := range c.manager.clients {
					if wsclient.userId == creatorId {
						message, _ := json.Marshal(res)
						wsclient.eggress <- message
					}
				}
			} else if res.Type == EVENTNOTIFICATION_TYPE {
				// notfiy the users in the group that event have been created
				// get the users in the group
				groupUsers, err := DB.GetGroupUserIds(res.To) //assuming res.To is group id.
				if err != nil {
					log.Println(err)
				}

				group, err := DB.GetGroup(res.To, c.userId)
				if err != nil {
					log.Println(err)
				}

				res.Message = res.UserName + " created an event " + res.Message + " in your group " + group.GroupName

				for groupUser := range groupUsers {
					for wsclient := range c.manager.clients {
						if wsclient.userId == groupUser && wsclient.userId != res.From {
							message, _ := json.Marshal(res)
							wsclient.eggress <- message
						}
					}
				}
			}

		}
	}
}

// writeMessages is a process that listens for new messages to output to the Client
func (c *Client) writeMessages() {
	defer func() {
		c.manager.removeClient(c)
	}()

	for {
		select {
		case message, ok := <-c.eggress:
			// Ok will be false Incase the egress channel is closed
			if !ok {
				// Manager has closed this connection channel, so communicate that to frontend
				if err := c.connection.WriteMessage(websocket.CloseMessage, nil); err != nil {
					// Log that the connection is closed and the reason
					log.Println("connection closed: ", err)
				}
				// Return to close the goroutine
				return
			}

			// Write a Regular text message to the connection
			if err := c.connection.WriteMessage(websocket.TextMessage, message); err != nil {
				log.Println(err)
			}
		}
	}
}
