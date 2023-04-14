package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

func IsLogin(w http.ResponseWriter, r *http.Request) {
	if IsOn(w, r) {
		GetErrResponse(w, "Authorized", http.StatusOK)
	} else {
		GetErrResponse(w, "Unauthorized", http.StatusUnauthorized)
	}
}

func Login(w http.ResponseWriter, r *http.Request) {
	//parse form
	err := r.ParseForm()
	if err != nil {
		GetErrResponse(w, "Parsing form failed", http.StatusBadRequest)
		return
	}

	fmt.Println(r.FormValue("email"))
	fmt.Println(r.FormValue("password"))

	// Getting the credentials (given by the user) from the login form
	username := r.FormValue("email")
	password := r.FormValue("password")
	fmt.Println("username: ", username)
	fmt.Println("password: ", password)

	// Getting the password of the given user from the database
	expected_pass, err := DB.GetPassword4User(username)
	if err != nil {
		GetErrResponse(w, "Auth failed", http.StatusUnauthorized)
		return
	}

	if !CheckPasswordHash(expected_pass, password) {
		GetErrResponse(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Setting the client cookie with a generated session token
	err = SetClientCookieWithSessionToken(w, username)
	if err != nil {
		GetErrResponse(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	fmt.Println("login successful")
	w.WriteHeader(http.StatusOK)
	response := Response{Status: RESPONSE_OK}
	for _, session := range sessions {
		if strings.Compare(session.Username, username) == 0 {
			response.Token = session.Cookie
			response.UserId = session.UserId
		}
	}
	res, _ := json.Marshal(response)
	io.WriteString(w, string(res))
}
