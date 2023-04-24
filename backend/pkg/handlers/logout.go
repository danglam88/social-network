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
	responseJson, _ := json.Marshal(response)
	io.WriteString(w, string(responseJson))
}
