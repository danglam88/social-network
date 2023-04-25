package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
)

func GetFollows(w http.ResponseWriter, r *http.Request) {
	var err error

	params := r.URL.Query()

	filterUser := 0
	if userId, isExist := params["user_id"]; isExist {
		filterUser, err = strconv.Atoi(userId[0])
	}

	if filterUser == 0 {
		username := IsUser(w, r)
		filterUser = DB.GetUserID(username)
	}

	if err != nil {
		errorMess := "Invalid Id"
		GetErrResponse(w, errorMess, http.StatusBadRequest)
		return
	}

	follows, err := DB.GetFollows(filterUser)

	if err != nil {
		errorMess := "Error while getting follows"
		GetErrResponse(w, errorMess, http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusAccepted)
	res, _ := json.Marshal(follows)
	io.WriteString(w, string(res))
}
