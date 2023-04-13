package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"os/signal"
	. "socialnetwork/backend/pkg/db/sqlite"
	"syscall"
	"time"

	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

var time_format = "2006-01-02 15:04:05"

type Db struct {
	connection *sql.DB
}

type Post struct {
	ID          int
	CreatorID   int
	CreatorName string
	GroupID     int
	Visibility  int
	Title       string
	Content     string
	CreatedAt   time.Time
	ImgUrl      string
}

type PostFilter struct {
	ID         int
	CategoryID int
}

type Comment struct {
	ID        int
	UserID    int
	UserName  string
	PostID    int
	Content   string
	CreatedAt time.Time
	ImgUrl    string
}

type User struct {
	ID        int
	FirstName string
	LastName  string
	BirthDate string
	IsPrivate int
	Password  string
	Email     string
	CreatedAt string
	AvatarUrl string
	NickName  string
	AboutMe   string
}

type Message struct {
	From      int       `json:"from"`
	To        int       `json:"to"`
	Message   string    `json:"message"`
	Username  string    `json:"username"`
	CreatedAt time.Time `json:"created_at"`
}

type MessageUser struct {
	Id          int    `json:"id"`
	UserName    string `json:"username"`
	Status      bool   `json:"status"`
	HasMessages bool   `json:"has_messages"`
}

// Opening the database
func OpenDatabase() Db {
	db, err := sql.Open("sqlite3", "./backend/pkg/db/socialnetwork.db?parseTime=true")
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return Db{}
	}

	existed := false
	if _, err := os.Stat("./backend/pkg/db/socialnetwork.db"); err == nil {
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

		err = os.Remove("./backend/pkg/db/socialnetwork.db")
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

// function to create user
func (db *Db) AddUser(username, password, email string, prev int) (bool, error) {

	//insert into user table
	_, err := db.connection.Exec("insert into user(privilege,username,passwrd,email,created_at) values(?,?,?,?,?)", prev, username, password, email, time.Now().Local().Format(time_format))
	return err != nil, err
}

// function in use
func (db *Db) GetPost(userfilter, groupfilter int) (posts []Post, err error) {
	var post Post
	var query string

	query = "select id,creator_id,group_id,visibility,title,content,created_at,img_url from post"

	if userfilter > 0 {
		query = query + fmt.Sprintf(" where creator_id = %v", userfilter)
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
			//handle
		}
		post.CreatorName = username
		posts = append(posts, post)
	}
	defer rows.Close()

	return posts, err
}

func (db *Db) getPostsIdByCategory(categoryId int) (postsId []string, err error) {

	var postId string
	rows, err := db.connection.Query("select post_id from category_relation where category_id = ?", categoryId)
	if err != nil {
		return postsId, err
	}

	for rows.Next() {
		err := rows.Scan(&postId)
		if err != nil {
			return postsId, err
		}
		postsId = append(postsId, postId)
	}
	defer rows.Close()

	return postsId, err
}

// function to make a post
func (db *Db) CreatePost(userID int, title, content string) (postID int64, err error) {

	created_time := time.Now().Local().Format(time_format)

	//insert into post table
	res, err := db.connection.Exec("insert into post(user_id,title,content,created_at, dummy) values(?,?,?,?,?)", userID, title, content, created_time, 0)

	if err != nil {
		return postID, err
	}

	postID, err = res.LastInsertId()
	return postID, err
}

// in use
func (db *Db) GetCommentsByPost(postId int) (comments []Comment, err error) {
	var comment Comment

	query := fmt.Sprintf("select id,creator_id,post_id,content,created_at,img_url from comment")

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
		comments = append(comments, comment)
	}
	defer rows.Close()

	return comments, err
}

func (db *Db) GetCategories() (map[int]string, error) {
	var id int
	var name string

	categories := make(map[int]string)

	query := "select id,category_name from category"
	rows, err := db.connection.Query(query)
	if err != nil {
		return categories, err
	}

	for rows.Next() {
		err := rows.Scan(&id, &name)
		if err != nil {
			return categories, err
		}
		categories[id] = name
	}
	defer rows.Close()

	return categories, err
}

// Get category id from category name
func (db *Db) GetCategoryID(category string) int {
	var id int

	row := db.connection.QueryRow("select id from category where id = ?", category)
	err := row.Scan(&id)
	if err != nil {
		return 0
	}

	return id
}

// Set relation between post and category
func (db *Db) SetCategoryRelation(postID int, categoryID int) (err error) {

	//insert into post table
	_, err = db.connection.Exec("insert into category_relation(post_id,category_id) values(?,?)", postID, categoryID)
	return err
}

func (db *Db) GetUserID(username string) int {
	// Creating a variable to hold the expected user
	var expected_user User
	// Reading the only row and saving the returned user
	row := db.connection.QueryRow("select id,username,passwrd,email,created_at from user where username = ?", username)
	err := row.Scan(&expected_user.ID, &expected_user.NickName, &expected_user.Password, &expected_user.Email, &expected_user.CreatedAt)
	if err != nil {
		//fmt.Fprintln(os.Stderr, err)
		return -1
	}
	return expected_user.ID
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

func (db *Db) CreateUser(username, password, email, firstName, lastName, gender, age string, prev int) string {
	//insert into user table
	_, err := db.connection.Exec("insert into user(privilege,username,first_name,last_name,gender,age,passwrd,email,created_at) values(?,?,?,?,?,?,?,?,?)", prev, username, firstName, lastName, gender, age, password, email, time.Now().Local().Format(time_format))
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
	row := db.connection.QueryRow("select id,passwrd from user where username = ?", username)
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
	row := db.connection.QueryRow("select id,nickname from user where id = ?", id)
	err = row.Scan(&expected_user.ID, &expected_user.NickName)
	if err != nil {
		return "", err
	}
	return expected_user.NickName, err
}

func (db *Db) GetAllUsers(username string) (users []User, err error) {

	query := "select id,firstname,lastname,birthdate,is_private,created_at,avatar_url,nickname,about_me from user where nickname != ? order by nickname asc"
	rows, err := db.connection.Query(query, username)
	if err != nil {
		return users, err
	}

	var user User
	for rows.Next() {
		err := rows.Scan(&user.ID, &user.FirstName, &user.LastName, &user.BirthDate, &user.IsPrivate, &user.CreatedAt, &user.AvatarUrl, &user.NickName, &user.AboutMe)
		if err != nil {
			return users, err
		}
		users = append(users, user)
	}
	defer rows.Close()

	return users, err
}

func (db *Db) GetUsers(userId int) (users []MessageUser, err error) {

	userSort, err := db.GetUsersOrderByMessage(userId)
	query := "select id, username from user order by username asc"
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
}

func (db *Db) GetUsersOrderByMessage(userId int) (users []int, err error) {
	rows, err := db.connection.Query("select user_1, user_2 from message  left join chat on  chat.id=message.chat_id where user_1=? or user_2=? order by message.created_at desc;", userId, userId)
	if err != nil {
		return users, err
	}

	var user1, user2 int
	isExists := make(map[int]bool)

	for rows.Next() {

		err := rows.Scan(&user1, &user2)
		if err != nil {
			return users, err
		}

		if user1 == userId {
			if !isExists[user2] {
				users = append(users, user2)
				isExists[user2] = true
			}
		} else {
			if !isExists[user1] {
				users = append(users, user1)
				isExists[user1] = true
			}
		}
	}
	defer rows.Close()

	return users, err
}

func (db *Db) AddMessage(from, to int, message string, time string) (err error) {

	var id int64

	id, err = db.getChat(from, to)

	//todo err check
	if id <= 0 {
		id, err = db.addChat(from, to)
	}

	_, err = db.connection.Exec("insert into message(chat_id, user, content,created_at) values(?,?,?,?)", id, from, message, time)

	return err
}

func (db *Db) addChat(from, to int) (chatId int64, err error) {

	res, err := db.connection.Exec("insert into chat(user_1, user_2,created_at) values(?,?,?)", from, to, time.Now().Local().Format(time_format))

	if err != nil {
		return chatId, err
	}

	chatId, err = res.LastInsertId()
	return chatId, err
}

func (db *Db) getChat(from, to int) (id int64, err error) {

	// Reading the only row and saving the returned user
	row := db.connection.QueryRow("select id from chat where user_1 = ? and user_2 = ? or user_1 = ? and user_2 = ?  ", from, to, to, from)
	err = row.Scan(&id)
	if err != nil {
		return id, err
	}
	return id, err
}

func (db *Db) GetHistory(from, to, page int) (messages []Message, err error) {
	var id int64

	id, err = db.getChat(from, to)

	//todo err check
	if id <= 0 {
		id, err = db.addChat(from, to)
	}

	rows, err := db.connection.Query("select user, content, created_at from message where chat_id = ? order by id desc limit ? offset ?", id, 10, page*10)
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
		}

		message.Username, _ = users[message.From]
		messages = append(messages, message)
	}
	defer rows.Close()

	return messages, err
}

// in use
func (db *Db) CreateComment(user_id int, postID int, comment string, username string, img_url string) Comment {

	var newComment Comment

	_, err := db.connection.Exec("insert into comment(creator_id,post_id,content,created_at,img_url) values(?,?,?,?)", user_id, postID, comment, time.Now().Local().Format(time_format), img_url)

	if err != nil {
		return newComment
	}

	newComment.UserID = user_id
	newComment.UserName = username
	newComment.PostID = postID
	newComment.Content = comment
	newComment.CreatedAt = time.Now().Local()
	newComment.ImgUrl = img_url

	return newComment
}

func (db *Db) AddGroupMessage(fromUserId, toGroupId int, message, createdAt string) error {

	query := "select id from group_chat where group_id=?"
	row := db.connection.QueryRow(query, toGroupId)
	var groupChatId int
	err := row.Scan(&groupChatId)
	if err != nil {
		return err
	}

	_, err = db.connection.Exec("insert into group_message(group_chatid,content,sender_id,created_at) values(?,?,?,?)", groupChatId, message, fromUserId, createdAt)
	if err != nil {
		fmt.Println(err)
	}

	return err
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
