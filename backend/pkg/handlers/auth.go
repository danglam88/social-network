package handlers

import (
	"fmt"
	"net/http"
	"strings"
	"time"

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
func SetClientCookieWithSessionToken(w http.ResponseWriter, username string) error {

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

	// Setting the cookie of the current client with the above-generated session token
	http.SetCookie(w, &http.Cookie{Name: "session_token", Value: session_token, Path: "/"})

	return nil
}

// Authenticating the user with the client cookie
func AuthenticateUser(w http.ResponseWriter, r *http.Request) string {

	// Getting the session token from the requested cookie
	cookie, err := r.Cookie("session_token")
	if err == http.ErrNoCookie {
		//fmt.Fprintln(os.Stderr, err)
		return "401 UNAUTHORIZED: CLIENT COOKIE NOT SET"
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

	return session.Username
}

// Getting the user-id of the currently logged-in user
func GetLoggedInUserID(w http.ResponseWriter, r *http.Request) int {

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
		return "400 BAD REQUEST: REQUEST NOT ALLOWED"
	}

	//todo cookie is nil
	session_token := cookie.Value

	// Removing the current session and resetting the client cookie
	delete(sessions, session_token)
	http.SetCookie(w, &http.Cookie{Name: "session_token", Value: "", Expires: time.Now(), Path: "/"})

	return "200 OK"
}

func IsOn(w http.ResponseWriter, r *http.Request) bool {
	// Getting the session token from the requested cookie
	cookie, err := r.Cookie("session_token")
	if err != nil {
		//http.Redirect(w, r, "/", http.StatusUnauthorized)
		return false
	}
	//Getting username and check id from session
	session, status := sessions[cookie.Value]
	if !status {
		//http.Redirect(w, r, "/", http.StatusUnauthorized)
		return false
	}

	user_name := session.Username
	fmt.Println(user_name)

	//Checking if user is logged in
	if user_name == "" {
		//http.Redirect(w, r, "/", http.StatusUnauthorized)
		return false
	}

	return true
}

func IsUser(w http.ResponseWriter, r *http.Request) string {
	//Get username from session not checking for error as we know it exists
	cookie, err := r.Cookie("session_token")
	if err != nil {
		return ""
	}

	session, status := sessions[cookie.Value]
	if !status {
		return ""
	}

	username := session.Username

	return username
}
