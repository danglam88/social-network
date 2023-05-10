package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

func LoggedIn(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	response := Response{Status: RESPONSE_OK}
	username := IsUser(w, r)

	if username != "" {
		for _, session := range sessions {
			if strings.Compare(session.Username, username) == 0 {
				response.Token = session.Cookie
				response.UserId = session.UserId
				response.Username = session.Username
				break
			}
		}
	} else {
		response.Token = ""
		response.UserId = 0
		response.Username = ""
	}

	res, err := json.Marshal(response)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	io.WriteString(w, string(res))
}
