package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gofrs/uuid"
)

type Session struct {
	Username string //email
	UserId   int
	Cookie   string
}

// Creating a global variable sessions to hold all the currently active sessions
var sessions = make(map[string]Session)

// Setting the client cookie with a generated session token
func SetNewSessionWithSessionToken(w http.ResponseWriter, username string) error {
	// Creating a random session token
	u2, err := uuid.NewV4()
	if err != nil {
		return err
	}
	session_token := u2.String()

	// Removing old session with the same username if that user was logged-in somewhere else before
	for old_session_token, old_session := range sessions {
		if strings.Compare(old_session.Username, username) == 0 {
			delete(sessions, old_session_token)
		}
	}

	// Creating a new session for the given user with the above-generated session token
	sessions[session_token] = Session{Username: username, UserId: DB.GetUserID(username), Cookie: session_token}

	return nil
}

// Authenticating the user with the client cookie
func AuthenticateUser(w http.ResponseWriter, r *http.Request) string {
	session_token := getToken(w, r)

	// Getting the corresponding session from the given session token
	session, status := sessions[session_token]
	if !status {
		return "401 UNAUTHORIZED: INVALID SESSION TOKEN"
	}

	return session.Username
}

// Getting the user-id of the currently logged-in user
func GetLoggedInUserID(w http.ResponseWriter, r *http.Request) int {

	// Authenticating the user with the client cookie
	mess := AuthenticateUser(w, r)
	if strings.Compare(mess[:4], "401 ") == 0 {
		return -1
	}

	return DB.GetUserID(mess)
}

// Logging the currently logged-in user out
func LogUserOut(w http.ResponseWriter, r *http.Request) {
	session_token := getToken(w, r)

	// Removing the current session and resetting the client cookie
	delete(sessions, session_token)
}

func IsOn(w http.ResponseWriter, r *http.Request) bool {
	token := getToken(w, r)
	if token == "" {
		return false
	}

	//Getting username and check id from session
	session, status := sessions[token]
	if !status {
		return false
	}

	user_name := session.Username
	fmt.Println(user_name)

	return user_name != ""
}

func IsUser(w http.ResponseWriter, r *http.Request) string {
	token := getToken(w, r)
	if token == "" {
		return ""
	}

	session, status := sessions[token]
	if !status {
		return ""
	}

	return session.Username
}

func getToken(w http.ResponseWriter, r *http.Request) string {
	token := r.Header.Get("Authorization")
	if token != "" {
		token = strings.Replace(token, "Bearer ", "", 1)
		log.Printf("Received token: %s", token)
	} else {
		log.Printf("No token received")
	}

	return token
}
