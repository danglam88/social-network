package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

func PersonalProfile(w http.ResponseWriter, r *http.Request) {
	if !IsOn(w, r) {
		GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	// Get the cookie
	cookie, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, return an unauthorized status
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		// For any other type of error, return a bad request status
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Use the person data
	fmt.Println("Token: ", cookie.Value)

	var userId int
	for _, session := range sessions {
		if strings.Compare(session.Cookie, cookie.Value) == 0 {
			userId = session.UserId
			break
		}
	}

	user := DB.GetUser(userId)

	// Send a response
	w.WriteHeader(http.StatusOK)
	res, _ := json.Marshal(user)
	io.WriteString(w, string(res))
}
