package handlers

import (
	"encoding/json"
	"io"
	"net/http"
)

func PersonalProfile(w http.ResponseWriter, r *http.Request) {
	userId := GetLoggedInUserID(w, r)
	user := DB.GetUser(userId)

	// Send a response
	w.WriteHeader(http.StatusOK)
	res, _ := json.Marshal(user)
	io.WriteString(w, string(res))
}
