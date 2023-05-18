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
	res, err := json.Marshal(user)
	if err != nil {
		GetErrResponse(w, "Unable to marshal user", http.StatusInternalServerError)
		return
	}
	io.WriteString(w, string(res))
}

func TogglePrivacy(w http.ResponseWriter, r *http.Request) {
	userId := GetLoggedInUserID(w, r)
	_, err := DB.TogglePrivacy(userId)
	if err != nil {
		GetErrResponse(w, "Error while toggling privacy", http.StatusInternalServerError)
		return
	}

	// for _, followerId := range followerIds {
	// 	Mgr.broadcastFollowNotification(userId, followerId, "", true)
	// }

	w.WriteHeader(http.StatusOK)
	response := ResponseError{Status: RESPONSE_OK}
	res, err := json.Marshal(response)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	io.WriteString(w, string(res))
}
