package handlers

import (
	"encoding/json"
	"io"
	"net/http"
)

func GetAllUsers(w http.ResponseWriter, r *http.Request) {

	// if !IsOn(w, r) {
	// 	GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
	// 	return
	// }

	user_nick := "malin" //IsUser(w, r)
	//user_id := DB.GetUserID(username)

	// if user_id != from {
	// 	GetErrResponse(w, "Invalid credentials", http.StatusUnauthorized)
	// 	return
	// }

	users, err := DB.GetAllUsers(user_nick)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusAccepted)
	res, _ := json.Marshal(users)
	io.WriteString(w, string(res))
}
