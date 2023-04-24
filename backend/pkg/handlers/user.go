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
		errorMess := "Invalid Id"
		GetErrResponse(w, errorMess, http.StatusBadRequest)
		return
	}

	user := DB.GetUser(filterUser)

	// Send a response
	w.WriteHeader(http.StatusOK)
	res, _ := json.Marshal(user)
	io.WriteString(w, string(res))
}
