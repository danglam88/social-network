package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gofrs/uuid"
)

type Session struct {
	Username    string
	Privilege   int
	Cookie      string
	ExpiredTime time.Time
}

// Creating a global variable sessions to hold all the currently active sessions
var sessions = make(map[string]Session)

// Setting the client cookie with a generated session token
func SetClientCookieWithSessionToken(w http.ResponseWriter, username string) error {

	// Creating a random session token and an expired time (30 minutes from the current time)
	u2, err := uuid.NewV4()
	if err != nil {
		return err
	}
	session_token := u2.String()
	expired_time := time.Now().Add(3600 * time.Second)

	//todo remove
	privilege := 1

	// Removing old session with the same username if that user was logged-in somewhere else before
	for old_session_token, old_session := range sessions {
		if strings.Compare(old_session.Username, username) == 0 {
			delete(sessions, old_session_token)
		}
	}

	// Creating a new session for the given user with the above-generated session token and expired time
	sessions[session_token] = Session{Username: username, Privilege: privilege, Cookie: session_token, ExpiredTime: expired_time}

	// Setting the cookie of the current client with the above-generated session token and expired time
	http.SetCookie(w, &http.Cookie{Name: "session_token", Value: session_token, Expires: expired_time, Path: "/"})

	userId := DB.GetUserID(username)
	http.SetCookie(w, &http.Cookie{Name: "user_id", Value: strconv.Itoa(userId), Expires: expired_time, Path: "/"})
	return nil
}

// Checking if the given session has already been expired
func sessionExpired(session Session) bool {
	return session.ExpiredTime.Before(time.Now())
}

// Authenticating the user with the client cookie
func AuthenticateUser(w http.ResponseWriter, r *http.Request) string {

	// Getting the session token from the requested cookie
	cookie, err := r.Cookie("session_token")
	if err == http.ErrNoCookie {
		//fmt.Fprintln(os.Stderr, err)
		return "401 UNAUTHORIZED: CLIENT COOKIE NOT SET OR SESSION EXPIRED"
	}
	if err != nil {
		//fmt.Fprintln(os.Stderr, err)
		return "400 BAD REQUEST: REQUEST NOT ALLOWED"
	}
	session_token := cookie.Value

	// Getting the corresponding session from the given session token
	session, status := sessions[session_token]
	if !status {
		http.SetCookie(w, &http.Cookie{Name: "session_token", Value: "", Expires: time.Now(), Path: "/"})
		return "401 UNAUTHORIZED: INVALID SESSION TOKEN"
	}

	// Checking if the session has already been expired and removing it if that is the case
	if sessionExpired(session) {
		delete(sessions, session_token)
		http.SetCookie(w, &http.Cookie{Name: "session_token", Value: "", Expires: time.Now(), Path: "/"})
		return "401 UNAUTHORIZED: SESSION EXPIRED"
	}

	return session.Username
}

// Getting the user-id of the currently logged-in user
func GetLoggedInUserID(w http.ResponseWriter, r *http.Request, db *sql.DB) int {

	// Authenticating the user with the client cookie
	mess := AuthenticateUser(w, r)
	if strings.Compare(mess[:4], "400 ") == 0 ||
		strings.Compare(mess[:4], "401 ") == 0 || !UserLoggedIn(mess) {
		return -1
	}

	return DB.GetUserID(mess)
}

// Checking if a given user is currently logged-in
func UserLoggedIn(username string) bool {
	for _, session := range sessions {
		if strings.Compare(session.Username, username) == 0 {
			return true
		}
	}

	return false
}

// Logging the currently logged-in user out
func LogUserOut(w http.ResponseWriter, r *http.Request) string {

	// Getting the session token from the requested cookie
	cookie, err := r.Cookie("session_token")
	if err == http.ErrNoCookie {
		return "200 OK"
	}
	if err != nil {
		return "401 "
	}

	//todo cookie is nil
	session_token := cookie.Value

	// Removing the current session and resetting the client cookie
	delete(sessions, session_token)
	http.SetCookie(w, &http.Cookie{Name: "session_token", Value: "", Expires: time.Now(), Path: "/"})

	return "200 OK"
}

// Refreshing the current session of the requested client (in case of a logged-in user)
func RefreshSession(w http.ResponseWriter, r *http.Request) {

	// Authenticating the user with the client cookie
	mess := AuthenticateUser(w, r)
	if strings.Compare(mess[:4], "400 ") == 0 ||
		strings.Compare(mess[:4], "401 ") == 0 || !UserLoggedIn(mess) {
		return
	}

	// Generating a new expired time (5 minutes from the current time)
	new_expired_time := time.Now().Add(300 * time.Second)

	for session_token, session := range sessions {
		if strings.Compare(session.Username, mess) == 0 {

			// Updating the session of the current user with the newly-generated expired time
			session.ExpiredTime = new_expired_time

			// Setting the cookie of the current client with the newly-generated expired time
			http.SetCookie(w, &http.Cookie{Name: "session_token", Value: session_token, Expires: new_expired_time, Path: "/"})

			break
		}
	}
}

func IsOn(w http.ResponseWriter, r *http.Request) bool {
	// Getting the session token from the requested cookie
	cookie, err := r.Cookie("session_token")
	if err != nil {
		//http.Redirect(w, r, "/", http.StatusUnauthorized)
		return false
	}
	//Getting username and check id from session
	x := sessions[cookie.Value]
	user_name := x.Username

	//Checking if user is logged in
	if user_name == "" {
		//http.Redirect(w, r, "/", http.StatusUnauthorized)
		return false
	}

	//Refreshing session and returning true
	RefreshSession(w, r)
	return true
}

func IsAdmin(w http.ResponseWriter, r *http.Request) bool {
	// Getting the session token from the requested cookie
	cookie, err := r.Cookie("session_token")
	if err != nil {
		//http.Redirect(w, r, "/", http.StatusUnauthorized)
		return false
	}
	//Getting username and check id from session
	x := sessions[cookie.Value]
	user_name := x.Username
	privilege := x.Privilege

	//Checking if user is logged in
	if user_name == "" {
		//http.Redirect(w, r, "/", http.StatusUnauthorized)
		return false
	}

	//Checking if user is admin
	if privilege != 5 {
		//http.Redirect(w, r, "/", http.StatusUnauthorized)
		return false
	}

	//Refreshing session and returning true
	RefreshSession(w, r)
	return true
}

func IsModerator(w http.ResponseWriter, r *http.Request) bool {
	// Getting the session token from the requested cookie
	cookie, err := r.Cookie("session_token")
	if err != nil {
		//http.Redirect(w, r, "/", http.StatusUnauthorized)
		return false
	}
	//Getting username and check id from session
	x := sessions[cookie.Value]
	user_name := x.Username
	privilege := x.Privilege

	//Checking if user is logged in
	if user_name == "" {
		//http.Redirect(w, r, "/", http.StatusUnauthorized)
		return false
	}

	//Checking if user is moderator
	if privilege != 3 {
		//http.Redirect(w, r, "/", http.StatusUnauthorized)
		return false
	}

	//Refreshing session and returning true
	RefreshSession(w, r)
	return true
}

func IsUser(w http.ResponseWriter, r *http.Request) string {
	//Get username from session not checking for error as we know it exists
	cookie, _ := r.Cookie("session_token")
	x := sessions[cookie.Value]
	username := x.Username
	return username
}
