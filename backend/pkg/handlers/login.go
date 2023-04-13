package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func IsLogin(w http.ResponseWriter, r *http.Request) {
	if IsOn(w, r) {
		GetErrResponse(w, "Authorized", http.StatusOK)
	} else {
		GetErrResponse(w, "Unauthorized", http.StatusUnauthorized)
	}
}

func Login(w http.ResponseWriter, r *http.Request) {
	test, _ := DB.GetChatOrderByMessage(1)
	fmt.Println(test)

	err := r.ParseForm()
	if err != nil {
		GetErrResponse(w, "Parsing form failed", http.StatusBadRequest)
		return
	}

	// Getting the credentials (given by the user) from the login form
	username := r.FormValue("uname")
	password := r.FormValue("pwd")

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

	w.WriteHeader(http.StatusOK)
	response := ResponseError{Status: RESPONSE_OK, Error: username}
	res, _ := json.Marshal(response)
	io.WriteString(w, string(res))
}
