package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
)

func GetUser(w http.ResponseWriter, r *http.Request) {
	var err error

	params := r.URL.Query()

	filterUser := 0
	if userId, isExist := params["user_id"]; isExist {
		filterUser, err = strconv.Atoi(userId[0])
	}

	if err != nil {
		GetErrResponse(w, "Invalid Id", http.StatusBadRequest)
		return
	}

	userId := GetLoggedInUserID(w, r)
	user := DB.GetUser(filterUser)

	if user.IsPrivate == 0 || DB.IsFollower(userId, user) {
		w.WriteHeader(http.StatusOK)
		res, _ := json.Marshal(user)
		io.WriteString(w, string(res))
	} else {
		w.WriteHeader(http.StatusOK)
		response := ResponseError{Status: RESPONSE_ERR}
		res, _ := json.Marshal(response)
		io.WriteString(w, string(res))
	}
}
