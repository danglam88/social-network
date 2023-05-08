package db

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sort"
	"strings"
	"syscall"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

var time_format = "2006-01-02 15:04:05"

type Db struct {
	connection *sql.DB
}

type Post struct {
	ID            int       `json:"id"`
	CreatorID     int       `json:"creator_id"`
	CreatorName   string    `json:"creator_name"`
	CreatorAvatar string    `json:"creator_avatar"`
	GroupID       int       `json:"group_id"`
	Visibility    int       `json:"visibility"`
	Title         string    `json:"title"`
	Content       string    `json:"content"`
	CreatedAt     time.Time `json:"created_at"`
	ImgUrl        string    `json:"img_url"`
}

type Comment struct {
	ID         int
	UserID     int
	UserName   string
	UserAvatar string
	PostID     int
	Content    string
	CreatedAt  time.Time
	ImgUrl     string
}

type User struct {
	ID        int    `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	BirthDate string `json:"birth_date"`
	IsPrivate int    `json:"is_private"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	CreatedAt string `json:"created_at"`
	AvatarUrl string `json:"avatar_url"`
	NickName  string `json:"nick_name"`
	AboutMe   string `json:"about_me"`
}

type Follows struct {
	UserID     int    `json:"user_id"`
	Username   string `json:"user_name"`
	Followers  []User `json:"followers"`
	Followings []User `json:"followings"`
	Pendings   []User `json:"pendings"`
}

type Group struct {
	ID          int       `json:"id"`
	CreatorId   int       `json:"creator_id"`
	GroupName   string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	AvatarUrl   string    `json:"avatar_url"`
	Members     []User    `json:"members"`
	IsMember    bool      `json:"is_member"`
	IsRequested bool      `json:"is_requested"`
	Posts       []Post    `json:"posts"`
	Events      []Event   `json:"events"`
}

type Event struct {
	ID          int       `json:"id"`
	CreatorId   int       `json:"creator_id"`
	CreatorName string    `json:"creator_name"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	OccurTime   time.Time `json:"occur_time"`
	VotedYes    int       `json:"voted_yes"`
	VotedNo     int       `json:"voted_no"`
	UserVote    int       `json:"user_vote"`
}

type Chat struct {
	ChatID      int
	GroupID     int
	UserOne     int
	UserTwo     int
	DisplayName string
	AvatarUrl   string
	LastMsg     time.Time
}

type Message struct {
	Type      string `json:"type"`
	From      int    `json:"from"`
	To        int    `json:"to"` //chat id
	Message   string `json:"message"`
	UserName  string `json:"username"`
	CreatedAt string `json:"created_at"`
}

type MessageUser struct {
	Id          int    `json:"id"`
	UserName    string `json:"username"`
	Status      bool   `json:"status"`
	HasMessages bool   `json:"has_messages"`
}

type GroupNotification struct {
	GroupId   int
	UserId    int
	UserName  string
	GroupName string
}

func RunMigrations(db *sql.DB, state bool) error {
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return err
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://./pkg/db/migrations/sqlite",
		"sqlite3", driver)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return err
	}

	if state {
		log.Println("Migrations UP applied")
		err = m.Up()
	} else {
		log.Println("Migrations DOWN applied")
		err = m.Down()
	}
	if err != nil && err != migrate.ErrNoChange {
		fmt.Fprintln(os.Stderr, err)
		return err
	}

	return nil
}

// Opening the database
func OpenDatabase() Db {
	db, err := sql.Open("sqlite3", "./pkg/db/socialnetwork.db?parseTime=true")
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return Db{}
	}

	existed := false
	if _, err := os.Stat("./pkg/db/socialnetwork.db"); err == nil {
		existed = true
	}

	if !existed {
		err := RunMigrations(db, true)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			return Db{}
		}
	}

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-stop

		err := RunMigrations(db, false)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			return
		}

		err = os.Remove("./pkg/db/socialnetwork.db")
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			return
		}

		os.Exit(1)
	}()

	return Db{connection: db}
}

func (db *Db) Close() {
	db.connection.Close()
}

func (db *Db) IsFollower(followerId, followdId int) bool {
	var isApproved int

	query := "select is_approved from follow_relation where follower_id=? and followed_id=?"
	row := db.connection.QueryRow(query, followerId, followdId)
	err := row.Scan(&isApproved)
	if err != nil {
		return false
	}

	if isApproved == 1 {
		return true
	}

	return false
}

func (db *Db) TogglePrivacy(userId int) (err error) {
	var isPrivate int

	query := "select is_private from user where id=?"
	row := db.connection.QueryRow(query, userId)
	err = row.Scan(&isPrivate)
	if err != nil {
		return err
	}

	if isPrivate == 1 {
		_, err = db.connection.Exec("update user set is_private=0 where id=?", userId)
		if err != nil {
			return err
		}

		_, err = db.connection.Exec("update follow_relation set is_approved=1 where followed_id=?", userId)
		if err != nil {
			return err
		}
	} else {
		_, err = db.connection.Exec("update user set is_private=1 where id=?", userId)
		if err != nil {
			return err
		}
	}

	return err
}

func (db *Db) ToggleFollow(followerId int, followedUser User) (err error) {
	var isApproved int

	query := "select is_approved from follow_relation where follower_id=? and followed_id=?"
	row := db.connection.QueryRow(query, followerId, followedUser.ID)
	err = row.Scan(&isApproved)
	if err != nil {
		if err == sql.ErrNoRows {
			var newErr error

			if followedUser.IsPrivate == 1 {
				_, newErr = db.connection.Exec("insert into follow_relation(follower_id,followed_id,is_approved) values(?,?,0)", followerId, followedUser.ID)
			} else {
				_, newErr = db.connection.Exec("insert into follow_relation(follower_id,followed_id,is_approved) values(?,?,1)", followerId, followedUser.ID)
			}

			if newErr != nil {
				return newErr
			}
		} else {
			return err
		}
	}

	if isApproved == 1 {
		_, newErr := db.connection.Exec("delete from follow_relation where follower_id=? and followed_id=?", followerId, followedUser.ID)
		if newErr != nil {
			return newErr
		}
	}

	if err == sql.ErrNoRows {
		return nil
	}

	return err
}

func (db *Db) CheckPending(followerId int, followedUser User) (isPending bool, err error) {
	var isApproved int

	query := "select is_approved from follow_relation where follower_id=? and followed_id=?"
	row := db.connection.QueryRow(query, followerId, followedUser.ID)
	err = row.Scan(&isApproved)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		} else {
			return false, err
		}
	}

	if isApproved == 0 {
		return true, err
	}

	return false, err
}

func (db *Db) ResolvePending(userId int, follower User, accepted bool) (err error) {
	if accepted {
		_, err = db.connection.Exec("update follow_relation set is_approved=1 where followed_id=? and follower_id=?", userId, follower.ID)
		if err != nil {
			return err
		}
	} else {
		_, err = db.connection.Exec("delete from follow_relation where followed_id=? and follower_id=?", userId, follower.ID)
		if err != nil {
			return err
		}
	}

	return err
}

func (db *Db) GetFollows(id int) (follows Follows, err error) {
	var follow_id int

	follows.UserID = id
	follows.Username, err = db.GetUserName(id)
	if err != nil {
		return follows, err
	}

	rows, err := db.connection.Query("select followed_id from follow_relation where follower_id=? and is_approved=1", id)
	if err != nil {
		return follows, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&follow_id)
		if err != nil {
			return follows, err
		}
		following := db.GetUser(follow_id)
		follows.Followings = append(follows.Followings, following)
	}

	rows, err = db.connection.Query("select follower_id from follow_relation where followed_id=? and is_approved=1", id)
	if err != nil {
		return follows, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&follow_id)
		if err != nil {
			return follows, err
		}
		follower := db.GetUser(follow_id)
		follows.Followers = append(follows.Followers, follower)
	}

	rows, err = db.connection.Query("select follower_id from follow_relation where followed_id=? and is_approved=0", id)
	if err != nil {
		return follows, err
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&follow_id)
		if err != nil {
			return follows, err
		}
		pending := db.GetUser(follow_id)
		follows.Pendings = append(follows.Pendings, pending)
	}

	return follows, nil
}

// function to create user
func (db *Db) AddUser(username, password, email string, prev int) (bool, error) {

	//insert into user table
	_, err := db.connection.Exec("insert into user(privilege,username,passwrd,email,created_at) values(?,?,?,?,?)", prev, username, password, email, time.Now().Local().Format(time_format))
	return err != nil, err
}

func (db *Db) GetVisiblePosts(followerId, followedId int) (visiblePosts []Post, err error) {
	var followId int

	row := db.connection.QueryRow("select id from follow_relation where follower_id=? and followed_id=? and is_approved=1", followerId, followedId)
	err = row.Scan(&followId)
	if err != nil {
		if err == sql.ErrNoRows {
			followId = -1
		} else {
			return visiblePosts, err
		}
	}

	posts, err := db.GetPosts(followedId, 0)
	if err != nil {
		return visiblePosts, err
	}

	for _, post := range posts {
		if post.Visibility == 0 || (post.Visibility == 1 && followId > 0) {
			visiblePosts = append(visiblePosts, post)
		} else if post.Visibility == 2 && followId > 0 {
			var visibleId int

			row := db.connection.QueryRow("select id from post_visibility where post_id=? and viewer_id=?", post.ID, followerId)
			err = row.Scan(&visibleId)
			if err != nil {
				if err == sql.ErrNoRows {
					visibleId = -1
				} else {
					return visiblePosts, err
				}
			}

			if visibleId > 0 {
				visiblePosts = append(visiblePosts, post)
			}
		}
	}

	if err == sql.ErrNoRows {
		err = nil
	}

	return visiblePosts, err
}

// function in use
func (db *Db) GetPosts(userfilter, groupfilter int) (posts []Post, err error) {
	var post Post
	var query string

	query = "select id,creator_id,group_id,visibility,title,content,created_at,img_url from post"

	if userfilter > 0 {
		query = query + fmt.Sprintf(" where creator_id = %v and group_id = 0", userfilter)
	} else if groupfilter > 0 {
		query = query + fmt.Sprintf(" where group_id = %v", groupfilter)
	}

	rows, err := db.connection.Query(query)
	if err != nil {
		return posts, err
	}

	for rows.Next() {
		err := rows.Scan(&post.ID, &post.CreatorID, &post.GroupID, &post.Visibility, &post.Title, &post.Content, &post.CreatedAt, &post.ImgUrl)
		if err != nil {
			return posts, err
		}
		username, err := db.GetUserName(post.CreatorID)
		if err != nil {
			return posts, err
		}
		post.CreatorName = username
		userAvatar := db.GetUserAvatar(post.CreatorID)
		post.CreatorAvatar = userAvatar
		posts = append(posts, post)
	}
	defer rows.Close()

	return posts, err
}

// function to make a post
func (db *Db) CreatePost(userID, groupID, visibility int, title, content, imgUrl string) (postID int64, err error) {

	created_time := time.Now().Local().Format(time_format)

	//insert into post table
	res, err := db.connection.Exec("insert into post(creator_id,group_id,visibility,title,content,created_at,img_url) values(?,?,?,?,?,?,?)", userID, groupID, visibility, title, content, created_time, imgUrl)

	if err != nil {
		return postID, err
	}

	postID, err = res.LastInsertId()
	return postID, err
}

// add users allowed to view a post
func (db *Db) CreatePostFollower(postID int64, followerID int) error {
	_, err := db.connection.Exec("insert into post_visibility(post_id,viewer_id) values(?,?)", postID, followerID)
	return err
}

// in use
func (db *Db) GetCommentsByPost(postId int) (comments []Comment, err error) {
	var comment Comment

	query := "select id,creator_id,post_id,content,created_at,img_url from comment"

	if postId != 0 {
		query = query + fmt.Sprintf(" where post_id = %v", postId)
	}

	rows, err := db.connection.Query(query)

	if err != nil {
		return comments, err
	}

	for rows.Next() {
		err := rows.Scan(&comment.ID, &comment.UserID, &comment.PostID, &comment.Content, &comment.CreatedAt, &comment.ImgUrl)
		if err != nil {
			return comments, err
		}
		comment.UserName, err = db.GetUserName(comment.UserID)
		if err != nil {
			//todo error
			fmt.Println(err)
		}
		comment.UserAvatar = db.GetUserAvatar(comment.UserID)
		comments = append(comments, comment)
	}
	defer rows.Close()

	return comments, err
}

func (db *Db) GetUserID(username string) int {
	// Creating a variable to hold the expected user
	var userId int
	// Reading the only row and saving the returned user
	row := db.connection.QueryRow("select id from user where email = ?", username)
	err := row.Scan(&userId)
	if err != nil {
		//fmt.Fprintln(os.Stderr, err)
		return -1
	}
	return userId
}

func (db *Db) GetEmail(mail string) string {
	var expected_user User
	// Reading the only row and saving the returned user
	row := db.connection.QueryRow("select id,username,passwrd,email,created_at from user where email = ?", mail)
	err := row.Scan(&expected_user.ID, &expected_user.NickName, &expected_user.Password, &expected_user.Email, &expected_user.CreatedAt)
	if err != nil {
		return ""
	}
	return expected_user.Email
}

func (db *Db) GetUserAvatar(CreatorID int) string {
	var avatar string

	row := db.connection.QueryRow("select avatar_url from user where id = ?", CreatorID)
	err := row.Scan(&avatar)
	if err != nil {
		return ""
	}
	return avatar
}

func (db *Db) EmailExists(mail string) bool {
	var count int

	row := db.connection.QueryRow("select count(*) from user where email = ?", mail)
	err := row.Scan(&count)
	if err != nil {
		return false
	}
	if count > 0 {
		return true
	} else {
		return false
	}
}

func (db *Db) CreateUser(username, password, email, firstName, lastName, birth, about, avatar string, prev int) string {
	// insert into user table
	_, err := db.connection.Exec("insert into user(email,passwrd,firstname,lastname,birthdate,is_private,created_at,avatar_url,nickname,about_me) values(?,?,?,?,?,?,?,?,?,?)", email, password, firstName, lastName, birth, prev, time.Now().Local().Format(time_format), avatar, username, about)
	if err != nil {
		log.Fatal(err)
	}
	return "200 OK"
}

// Getting the password of the given user from the database
func (db *Db) GetPassword4User(username string) (string, error) {

	// Creating a variable to hold the expected user
	var expected_user User

	// Reading the only row and saving the returned user
	row := db.connection.QueryRow("select id,passwrd from user where email = ?", username)
	err := row.Scan(&expected_user.ID, &expected_user.Password)
	if err != nil {
		return "", err
	}

	return expected_user.Password, err
}

func (db *Db) GetUserName(id int) (string, error) {
	// Creating a variable to hold the expected user
	var expected_user User
	var err error

	// Reading the only row and saving the returned user
	row := db.connection.QueryRow("select id,nickname,firstname,lastname from user where id = ?", id)
	err = row.Scan(&expected_user.ID, &expected_user.NickName, &expected_user.FirstName, &expected_user.LastName)
	if err != nil {
		return "", err
	}

	username := expected_user.NickName
	if len(username) == 0 {
		username = expected_user.FirstName + " " + expected_user.LastName
	}

	return username, err
}

func (db *Db) GetGroup(id, userId int) (group Group, err error) {

	row := db.connection.QueryRow("select id,creator_id,group_name,descript,created_at,avatar_url from user_group where id = ?", id)
	err = row.Scan(&group.ID, &group.CreatorId, &group.GroupName, &group.Description, &group.CreatedAt, &group.AvatarUrl)
	if err != nil {
		fmt.Println(err)
		return group, err
	}

	members := db.GetGroupMembers(group.ID)

	posts, err := db.GetPosts(0, id)

	if err != nil {
		fmt.Println(err)
		return group, err
	}
	for i := range posts {
		posts[i].Content = strings.ReplaceAll(posts[i].Content, "\r\n", "<br>")
	}

	//sort posts reversed
	for i, j := 0, len(posts)-1; i < j; i, j = i+1, j-1 {
		posts[i], posts[j] = posts[j], posts[i]
	}

	events, err := db.GetEvents(id, userId)

	if err != nil {
		fmt.Println(err)
		return group, err
	}

	group.Members = members
	group.Posts = posts
	group.Events = events

	return group, err
}

func (db *Db) GetEvents(groupId, userId int) (events []Event, err error) {

	rows, err := db.connection.Query("select id,creator_id,title,descript,occur_time from event where group_id = ?", groupId)
	if err != nil {
		return events, err
	}

	var event Event

	for rows.Next() {
		err := rows.Scan(&event.ID, &event.CreatorId, &event.Name, &event.Description, &event.OccurTime)
		if err != nil {
			return events, err
		}

		creator := db.GetUser(event.CreatorId)
		if creator.NickName != "" {
			event.CreatorName = creator.NickName
		} else {
			event.CreatorName = creator.FirstName + " " + creator.LastName
		}

		event.VotedYes, event.VotedNo, event.UserVote, err = db.GetVotes(event.ID, userId)

		if err != nil {
			return events, err
		}

		events = append(events, event)
	}
	return events, err
}

func (db *Db) GetVotes(eventId, userId int) (votedYes, votedNo, userVote int, err error) {

	votedYes = 0
	votedNo = 0
	userVote = -1

	query := "select user_id, is_going from event_relation where event_id = ? and is_approved = 1"
	rows, err := db.connection.Query(query, eventId)
	if err != nil {
		fmt.Println(err)
		return votedYes, votedNo, userVote, err
	}

	for rows.Next() {
		var eventUserId, isGoing int

		err := rows.Scan(&eventUserId, &isGoing)

		if err != nil {
			fmt.Println(err)
		}

		if isGoing == 0 {
			votedNo++
		}
		if isGoing == 1 {
			votedYes++
		}

		if eventUserId == userId {
			userVote = isGoing
		}
	}
	defer rows.Close()

	return votedYes, votedNo, userVote, err
}

func (db *Db) GetAllGroups(userId int) (groups []Group, err error) {

	rows, err := db.connection.Query("select id,creator_id,group_name,descript,created_at from user_group")
	if err != nil {
		return groups, err
	}

	userGroups, userRequests, err := db.GetUserGroups(userId)

	if err != nil {
		return groups, err
	}

	var group Group
	for rows.Next() {
		err := rows.Scan(&group.ID, &group.CreatorId, &group.GroupName, &group.Description, &group.CreatedAt)
		if err != nil {
			return groups, err
		}

		members := db.GetGroupMembers(group.ID)

		group.Members = members
		group.IsMember = userGroups[group.ID]
		group.IsRequested = userRequests[group.ID]

		groups = append(groups, group)
	}

	return groups, err
}

func (db *Db) GetGroupMembers(groupId int) (members []User) {
	userIds := []int{}
	query := "select user_id from group_relation where group_id = ? and is_approved = 1"
	rows, err := db.connection.Query(query, groupId)
	if err != nil {
		fmt.Println(err)
		return members
	}

	for rows.Next() {
		var userId int
		err := rows.Scan(&userId)
		if err != nil {
			fmt.Println(err)

		}
		userIds = append(userIds, userId)
	}
	defer rows.Close()

	for _, id := range userIds {
		user := db.GetUser(id)
		members = append(members, user)
	}

	return members
}

// fetches all chats this user is included in, sorted by last message date
func (db *Db) GetAllChats(userId int) (chats []Chat, err error) {
	var chat Chat
	query := "select id,group_id,first_userid,second_userid from private_chat where group_id in (select group_id from group_relation where user_id = ? and is_approved = 1) or first_userid = ? or second_userid = ?"
	rows, err := db.connection.Query(query, userId, userId, userId)
	if err != nil {
		return chats, err
	}
	for rows.Next() {
		err := rows.Scan(&chat.ChatID, &chat.GroupID, &chat.UserOne, &chat.UserTwo)
		if err != nil {
			return chats, err
		}
		//fetch date for last message from private message table
		chat.LastMsg = db.GetLastMessage(chat.ChatID)
		chats = append(chats, chat)
	}
	defer rows.Close()

	//sort chats by last message date
	sort.Slice(chats, func(i, j int) bool {
		return chats[i].LastMsg.After(chats[j].LastMsg)
	})
	//add displayname to the chats visual use
	for i := range chats {
		if chats[i].GroupID != 0 {
			wholeGroup, _ := db.GetGroup(chats[i].GroupID, userId)
			chats[i].DisplayName = wholeGroup.GroupName
			chats[i].AvatarUrl = wholeGroup.AvatarUrl
		} else if chats[i].UserOne == userId {
			chats[i].DisplayName, _ = db.GetUserName(chats[i].UserTwo)
			chats[i].AvatarUrl = db.GetUser(chats[i].UserTwo).AvatarUrl
		} else {
			chats[i].DisplayName, _ = db.GetUserName(chats[i].UserOne)
			chats[i].AvatarUrl = db.GetUser(chats[i].UserOne).AvatarUrl
		}
	}
	return chats, err
}

func (db *Db) GetLastMessage(chatId int) time.Time {
	var msgTime time.Time
	query := "select created_at from private_message where chat_id = ? order by created_at desc limit 1"
	row := db.connection.QueryRow(query, chatId)
	err := row.Scan(&msgTime)
	if err != nil {
		fmt.Println(err)
	}
	return msgTime
}

func (db *Db) CreateGroup(creatorId int, title, description string) (groupId int64, err error) {

	res, err := db.connection.Exec("insert into user_group(creator_id,group_name,descript,created_at,avatar_url) values(?,?,?,?,?)", creatorId, title, description, time.Now().Local().Format(time_format), "/upload/group.png")
	if err != nil {
		return groupId, err
	}

	groupId, err = res.LastInsertId()
	if err != nil {
		return groupId, err
	}

	err = db.JoinToGroup(creatorId, int(groupId), 0, 1)

	return groupId, err
}

func (db *Db) CreateEvent(creatorId, groupId int, title, description string, occurTime time.Time) (eventId int64, err error) {

	res, err := db.connection.Exec("insert into event(creator_id,group_id,title,descript,occur_time,created_at) values(?,?,?,?,?,?)", creatorId, groupId, title, description, occurTime.Format(time_format), time.Now().Local().Format(time_format))
	if err != nil {
		return eventId, err
	}

	eventId, err = res.LastInsertId()
	if err != nil {
		return eventId, err
	}

	err = db.JoinToGroup(creatorId, int(groupId), 0, 1)

	return eventId, err
}

func (db *Db) JoinToGroup(userId, groupId, isRequested, isApproved int) (err error) {

	_, err = db.connection.Exec("insert into group_relation(user_id,group_id,is_requested,is_approved) values(?,?,?,?)", userId, groupId, isRequested, isApproved)
	return err
}

func (db *Db) GetGroupInvitations(userId int) (groups []Group, err error) {
	query := "select group_id, group_name from group_relation inner join user_group on user_group.id=group_relation.group_id where user_id=? and is_approved=0 and is_requested=0"
	rows, err := db.connection.Query(query, userId)

	if err != nil {
		return groups, err
	}

	var group Group
	for rows.Next() {
		err := rows.Scan(&group.ID, &group.GroupName)
		if err != nil {
			return groups, err
		}

		groups = append(groups, group)
	}

	defer rows.Close()

	return groups, err
}

func (db *Db) ReplyOnGroupInvitation(userId, groupId int, isAccepted bool) (err error) {

	if isAccepted {
		_, err = db.connection.Exec("update group_relation set is_approved=1 where user_id=? and group_id=?", userId, groupId)
	} else {
		_, err = db.connection.Exec("delete from group_relation where user_id=? and group_id=?", userId, groupId)
	}

	return err
}

func (db *Db) GetGroupRequests(groupId int) (users []User, err error) {

	query := "select user_id,firstname,lastname,nickname from user inner join group_relation on user.id=group_relation.user_id where group_id=? and is_approved=0 and is_requested=1"
	rows, err := db.connection.Query(query, groupId)

	if err != nil {
		return users, err
	}

	var user User
	for rows.Next() {
		err := rows.Scan(&user.ID, &user.FirstName, &user.LastName, &user.NickName)
		if err != nil {
			return users, err
		}

		users = append(users, user)
	}

	defer rows.Close()

	return users, err
}

func (db *Db) GetCreatorGroups(creatorId int) (groups []Group, err error) {

	query := "select id,group_name from user_group where creator_id=?"
	rows, err := db.connection.Query(query, creatorId)

	if err != nil {
		return groups, err
	}

	var group Group
	for rows.Next() {
		err := rows.Scan(&group.ID, &group.GroupName)
		if err != nil {
			return groups, err
		}

		groups = append(groups, group)
	}

	defer rows.Close()

	return groups, err
}

func (db *Db) JoinToEvent(userId, eventId, isApproved, isGoing int) (err error) {

	_, err = db.connection.Exec("insert into event_relation(user_id,event_id,is_approved, is_going) values(?,?,?,?) ON CONFLICT(event_id, user_id) DO UPDATE SET is_approved = 1, is_going = ?;", userId, eventId, isApproved, isGoing, isGoing)
	return err
}

func (db *Db) GetUserGroups(userId int) (groups map[int]bool, requests map[int]bool, err error) {

	groups = make(map[int]bool)
	requests = make(map[int]bool)

	query := "select group_id,is_requested,is_approved from group_relation where user_id=?"
	rows, err := db.connection.Query(query, userId)

	if err != nil {
		return groups, requests, err
	}

	var groupId int
	var isRequested int
	var isApproved int

	for rows.Next() {
		err := rows.Scan(&groupId, &isRequested, &isApproved)
		if err != nil {
			return groups, requests, err
		}

		if (isRequested == 1) && (isApproved == 0) {
			requests[groupId] = true
		}

		if isApproved == 1 {
			groups[groupId] = true
		}
	}

	defer rows.Close()

	return groups, requests, err
}

func (db *Db) GetUser(id int) User {
	var user User
	row := db.connection.QueryRow("select id,email,firstname,lastname,is_private,birthdate,created_at,nickname,avatar_url,about_me from user where id = ?", id)
	err := row.Scan(&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.IsPrivate, &user.BirthDate, &user.CreatedAt, &user.NickName, &user.AvatarUrl, &user.AboutMe)
	if err != nil {
		fmt.Println(err)
		return user
	}
	return user
}

func (db *Db) GetAllUsers(username string) (users []User, err error) {

	query := "select id,email,firstname,lastname,birthdate,is_private,created_at,avatar_url,nickname,about_me from user where email != ? order by id asc"
	rows, err := db.connection.Query(query, username)
	if err != nil {
		return users, err
	}

	var user User
	for rows.Next() {
		err := rows.Scan(&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.BirthDate, &user.IsPrivate, &user.CreatedAt, &user.AvatarUrl, &user.NickName, &user.AboutMe)
		if err != nil {
			return users, err
		}
		users = append(users, user)
	}
	defer rows.Close()

	return users, err
}

func (db *Db) GetNotGroupMembers(username string, groupId int) (users []User, err error) {

	query := "select id,email,firstname,lastname,birthdate,is_private,created_at,avatar_url,nickname,about_me from user where email != ? and id not in (select user_id from group_relation where group_id == ?) order by id asc"
	rows, err := db.connection.Query(query, username, groupId)
	if err != nil {
		return users, err
	}

	var user User
	for rows.Next() {
		err := rows.Scan(&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.BirthDate, &user.IsPrivate, &user.CreatedAt, &user.AvatarUrl, &user.NickName, &user.AboutMe)
		if err != nil {
			return users, err
		}
		users = append(users, user)
	}
	defer rows.Close()

	return users, err
}

/*func (db *Db) GetUsers(userId int) (chats []Chat, err error) {

	userChats, err := db.GetAllChats(userId)
	if err != nil {
		return chats, err
	}
	//sort userChats by last message date
	sort.Slice(userChats, func(i, j int) bool {
		return userChats[i].LastMsg.After(userChats[j].LastMsg)
	})

	rows, err := db.connection.Query(query)
	if err != nil {
		return users, err
	}

	var username string
	var id int
	var usersWithoutMessages []MessageUser
	var usersWithMessages map[int]MessageUser

	usersWithMessages = make(map[int]MessageUser)
	for rows.Next() {

		err := rows.Scan(&id, &username)
		if err != nil {
			return users, err
		}

		isExist := false
		for i := 0; i < len(userSort); i++ {
			if id == userSort[i] {
				usersWithMessages[i] = MessageUser{UserName: username, Id: id, Status: false, HasMessages: true}
				isExist = true
				break
			}
		}

		if !isExist {
			usersWithoutMessages = append(usersWithoutMessages, MessageUser{UserName: username, Id: id, Status: false, HasMessages: false})
		}
	}

	for i := 0; i < len(userSort); i++ {
		users = append(users, usersWithMessages[i])
	}

	users = append(users, usersWithoutMessages...)

	defer rows.Close()

	return users, err
	return userChats, err
}*/

/*func (db *Db) GetChatOrderByMessage(senderId int) (chatIds []int, err error) {
	rows, err := db.connection.Query(`
		SELECT DISTINCT chat_id
		FROM (
			SELECT private_chat.id AS chat_id, private_message.created_at AS created_at
			FROM private_chat
			JOIN private_message ON private_message.private_chatid = private_chat.id
			WHERE private_chat.first_userid = ? OR private_chat.second_userid = ?
			UNION ALL
			SELECT group_chat.id AS chat_id, group_message.created_at AS created_at
			FROM group_chat
			JOIN group_message ON group_message.group_chatid = group_chat.id
			JOIN group_relation ON group_relation.group_id = group_chat.group_id
			WHERE group_relation.user_id = ? AND group_relation.is_approved = 1
		) ORDER BY created_at DESC;
	`, senderId, senderId, senderId)
	if err != nil {
		return chatIds, err
	}
	defer rows.Close()

	for rows.Next() {
		var chatId int
		if err := rows.Scan(&chatId); err != nil {
			return chatIds, err
		}
		chatIds = append(chatIds, chatId)
	}
	if err := rows.Err(); err != nil {
		return chatIds, err
	}

	return chatIds, nil
}*/

// can be used for both private and group chats
func (db *Db) AddMessage(chatId, creator int, message, time string) (err error) {
	fmt.Println("AddMessage sqlite.go 936 - chatId, creator, message, time", chatId, creator, message, time)

	/*var id int64

	id, err = db.getChat(groupId, from, to)

	//todo err check
	if id <= 0 {
		id, err = db.addChat(groupId, from, to)
	}*/
	//id,chat_id,content,sender_id,created_at

	_, err = db.connection.Exec("insert into private_message(chat_id, sender_id, content, created_at) values(?,?,?,?)", chatId, creator, message, time)

	return err
}

// used for all chat creation
func (db *Db) addChat(groupId, from, to int) (chatId int, err error) {

	res, err := db.connection.Exec("insert into private_chat(group_id, first_userid, second_userid) values(?,?,?)", groupId, from, to)

	if err != nil {
		return chatId, err
	}

	//convert chatId to int64

	var chatId64 int64 = int64(chatId)

	chatId64, err = res.LastInsertId()

	chatId = int(chatId64)

	return chatId, err
}

func (db *Db) getChat(groupId, from, to int) (chatId int, err error) {
	query := "select id from private_chat where "
	var options []interface{}

	if groupId == 0 {
		query += "first_userid = ? and second_userid = ? or first_userid = ? and second_userid = ? "
		options = []interface{}{from, to, to, from}
	} else {
		query += "group_id = ?"
		options = []interface{}{groupId}
	}

	row := db.connection.QueryRow(query, options...)
	err = row.Scan(&chatId)
	if err != nil {
		return chatId, err
	}
	return chatId, err
}

/*func (db *Db) addGroupChat(from, to int) (chatId int64, err error) {

	res, err := db.connection.Exec("insert into group_chat(group_id) values(?)", to)

	if err != nil {
		return chatId, err
	}

	chatId, err = res.LastInsertId()
	return chatId, err
}*/

/*func (db *Db) getGroupChat(from, to int) (chatId int64, err error) {

	row := db.connection.QueryRow("select id from group_chat where group_id = ?", to)
	err = row.Scan(&chatId)
	if err != nil {
		return chatId, err
	}
	return chatId, err
}*/

/*func (db *Db) GetGroupHistory(from, to, page int) (messages []Message, err error) {
	var id int64

	id, err = db.getChat(to, 0, 0)

	//todo err check
	if id <= 0 {
		id, err = db.addChat(to, 0, 0)
	}

	rows, err := db.connection.Query("select sender_id, content, created_at from group_message where group_chatid = ? order by id desc limit ? offset ?", id, 10, page*10)
	if err != nil {
		return messages, err
	}

	var message Message
	users := make(map[int]string)

	for rows.Next() {

		err := rows.Scan(&message.From, &message.Message, &message.CreatedAt)
		if err != nil {
			return messages, err
		}

		if users[message.From] == "" {
			users[message.From], err = db.GetUserName(message.From)
			if err != nil {
				return messages, err
			}
		}

		message.Username, _ = users[message.From]

		messages = append(messages, message)
	}

	defer rows.Close()

	return messages, err
}*/

func (db *Db) GetHistory(groupId, from, to, page int) (messages []Message, chatId int, err error) {
	var id int

	id, err = db.getChat(groupId, from, to)

	//todo err check
	if id <= 0 {
		if groupId == 0 {
			user := db.GetUser(to)
			if user.IsPrivate == 1 && !db.IsFollower(from, user.ID) {
				err := errors.New("not allowed to send message to this user")
				return messages, id, err

			}
		}

		id, err = db.addChat(groupId, from, to)
	}

	// Log the SQL query and parameters
	query := "select sender_id, content, created_at from private_message where chat_id = ? order by id desc limit ? offset ?"

	rows, err := db.connection.Query(query, id, 10, (page-1)*10)
	if err != nil {
		return messages, id, err
	}

	var message Message
	users := make(map[int]string)

	for rows.Next() {

		err := rows.Scan(&message.From, &message.Message, &message.CreatedAt)
		if err != nil {
			fmt.Printf("Error in row scan: %v\n", err) // Debug log statement
			return messages, id, err
		}

		if users[message.From] == "" {
			users[message.From], err = db.GetUserName(message.From)
			if err != nil {
				fmt.Printf("Error in getting username: %v\n", err) // Debug log statement
				return messages, id, err
			}
		}

		message.UserName = users[message.From]
		messages = append(messages, message)
	}
	defer rows.Close()

	return messages, id, err
}

// in use
func (db *Db) CreateComment(userId int, postID int, comment string, imgUrl string) Comment {

	var newComment Comment
	//comment (id,creator_id,post_id,content,created_at,img_url)

	_, err := db.connection.Exec("insert into comment(creator_id,post_id,content,created_at,img_url) values(?,?,?,?,?)", userId, postID, comment, time.Now().Local().Format(time_format), imgUrl)

	if err != nil {
		return newComment
	}

	newComment.UserID = userId
	newComment.PostID = postID
	newComment.Content = comment
	newComment.CreatedAt = time.Now().Local()
	newComment.ImgUrl = imgUrl

	return newComment
}

/*func (db *Db) AddGroupMessage(groupId, from, to int, message, time string) error {

	var id int64

	id, err := db.getChat(groupId, from, to)

	//todo err check
	if id <= 0 {
		id, err = db.addChat(groupId, from, to)
	}

	_, err = db.connection.Exec("insert into group_message(group_chatid, sender_id, content, created_at) values(?,?,?,?)", id, from, message, time)
	if err != nil {
		fmt.Println(err)
	}

	return err
}*/

func (db *Db) GetGroupIdAndCreatorIdFromPostId(postId int) (groupId int, creatorId int, err error) {
	err = db.connection.QueryRow("SELECT group_id, creator_id FROM post WHERE id=?", postId).Scan(&groupId, &creatorId)
	if err != nil {
		return groupId, creatorId, err
	}
	return groupId, creatorId, err
}

func (db *Db) IsMember(userId, groupID int) bool {
	var id int
	err := db.connection.QueryRow("SELECT id FROM group_relation WHERE group_id=? AND user_id=?", groupID, userId).Scan(&id)
	if err != nil {
		return false
	}
	return true
}

func (db *Db) GetGroupUserIds(groupId int) (userIds []int, err error) {

	query := "select user_id from group_relation where group_id=?"
	rows, err := db.connection.Query(query, groupId)
	if err != nil {
		return userIds, err
	}

	var user_id int
	for rows.Next() {

		err := rows.Scan(&user_id)
		if err != nil {
			return userIds, err
		}

		userIds = append(userIds, user_id)
	}

	defer rows.Close()

	return userIds, err
}

func (db *Db) GetUserIdsfromChatId(chatId int) (userIds []int, err error) {
	var groupID, firstUserID, secondUserID int
	err = db.connection.QueryRow("SELECT group_id, first_userid, second_userid FROM private_chat WHERE id=?", chatId).Scan(&groupID, &firstUserID, &secondUserID)
	if err != nil {
		return nil, err
	}

	if groupID == 0 {
		userIds = append(userIds, firstUserID, secondUserID)
	} else {
		userIds, err = db.GetGroupUserIds(groupID)
		if err != nil {
			return nil, err
		}
	}
	return userIds, nil
}

func (db *Db) GetGroupCreatorId(groupId int) (creatorId int, err error) {

	query := "select creator_id from user_group where id=?"
	row := db.connection.QueryRow(query, groupId)
	err = row.Scan(&creatorId)
	if err != nil {
		return creatorId, err
	}

	return creatorId, err
}

func (db *Db) GetTime() string {
	return time.Now().Local().Format(time_format)
}

func (db *Db) GetFollowNotifications(userID int) ([]string, error) {
	var followers []string

	rows, err := db.connection.Query(`
		SELECT follow_relation.follower_id
		FROM follow_relation
		WHERE follow_relation.is_approved = 0 AND follow_relation.followed_id = ?
	`, userID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var followerId int
		err = rows.Scan(&followerId)
		if err != nil {
			return nil, err
		}
		var follower string
		follower, err = db.GetUserName(followerId)
		if err != nil {
			return nil, err
		}

		followers = append(followers, follower)
	}

	return followers, nil
}

func (db *Db) GetGroupNotifications(userID int) ([]GroupNotification, error) {
	var notifications []GroupNotification

	rows, err := db.connection.Query(`
		SELECT
			group_relation.group_id,
			group_relation.user_id
		FROM group_relation
		WHERE group_relation.is_requested = 1 AND group_relation.is_approved = 0 AND EXISTS (
			SELECT 1 FROM user_group WHERE user_group.id = group_relation.group_id AND user_group.creator_id = $1
		)`, userID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var notification GroupNotification
		err = rows.Scan(&notification.GroupId, &notification.UserId)
		if err != nil {
			return nil, err
		}

		notification.UserName, err = db.GetUserName(notification.UserId)
		if err != nil {
			return nil, err
		}

		group, err := db.GetGroup(notification.GroupId, userID)
		if err != nil {
			return nil, err
		}
		notification.GroupName = group.GroupName

		notifications = append(notifications, notification)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return notifications, nil
}

func (db *Db) GetGroupInviteNotifications(userId int) ([]string, error) {
	var groupswithinvites []string

	rows, err := db.connection.Query(`
		SELECT user_group.group_name
		FROM user_group
		WHERE user_group.id IN (
			SELECT group_relation.group_id
			FROM group_relation
			WHERE group_relation.is_requested = 0 AND group_relation.is_approved = 0 AND group_relation.user_id = ?
		)`, userId)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {

		var groupname string
		err = rows.Scan(&groupname)
		if err != nil {
			return nil, err
		}

		groupswithinvites = append(groupswithinvites, groupname)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return groupswithinvites, nil
}
