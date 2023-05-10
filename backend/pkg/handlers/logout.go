package handlers

import (
	"encoding/json"
	"io"
	"net/http"
)

func Logout(w http.ResponseWriter, r *http.Request) {
	// Logging the currently logged-in user out
	LogUserOut(w, r)

	w.WriteHeader(http.StatusOK)
	response := ResponseError{Status: RESPONSE_OK}
	responseJson, err := json.Marshal(response)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	io.WriteString(w, string(responseJson))
}
