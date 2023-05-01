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

func TogglePrivacy(w http.ResponseWriter, r *http.Request) {
	userId := GetLoggedInUserID(w, r)
	err := DB.TogglePrivacy(userId)
	if err != nil {
		GetErrResponse(w, "Error while toggling privacy", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := ResponseError{Status: RESPONSE_OK}
	res, _ := json.Marshal(response)
	io.WriteString(w, string(res))
}
