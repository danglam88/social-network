package handlers

import (
	"encoding/json"
	"io"
	"net/http"
)

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	if !IsOn(w, r) {
		GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	username := IsUser(w, r)

	users, err := DB.GetAllUsers(username)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusAccepted)
	res, _ := json.Marshal(users)
	io.WriteString(w, string(res))
}
