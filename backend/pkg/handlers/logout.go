package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

func Logout(w http.ResponseWriter, r *http.Request) {

	// Logging the currently logged-in user out
	res := LogUserOut(w, r)
	if strings.Compare(res, "200 OK") != 0 && strings.Compare(res[:4], "401 ") != 0 {
		GetErrResponse(w, res, http.StatusBadRequest) // WHICH STATUS?
		return
	}

	w.WriteHeader(http.StatusOK)
	response := ResponseError{Status: RESPONSE_OK}
	responseJson, _ := json.Marshal(response)
	io.WriteString(w, string(responseJson))
}
