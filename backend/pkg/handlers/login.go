package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

func Login(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		GetErrResponse(w, "Parsing form failed", http.StatusBadRequest)
		return
	}

	// Getting the credentials (given by the user) from the login form
	username := r.FormValue("email")
	password := r.FormValue("password")

	// Getting the password of the given user from the database
	expected_pass, err := DB.GetPassword4User(username)
	if err != nil {
		GetErrResponse(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	if !CheckPasswordHash(expected_pass, password) {
		GetErrResponse(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Setting the client cookie with a generated session token
	err = SetNewSessionWithSessionToken(w, username)
	if err != nil {
		GetErrResponse(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := Response{Status: RESPONSE_OK}
	for _, session := range sessions {
		if strings.Compare(session.Username, username) == 0 {
			response.Token = session.Cookie
			response.UserId = session.UserId
			response.Username = session.Username
			break
		}
	}
	res, err := json.Marshal(response)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	io.WriteString(w, string(res))
}
