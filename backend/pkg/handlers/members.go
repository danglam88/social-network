package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
)

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	username := IsUser(w, r)

	params := r.URL.Query()

	var err error
	filterId := 0

	if paramsId, isExist := params["group_id"]; isExist {
		filterId, err = strconv.Atoi(paramsId[0])
		if err != nil {
			GetErrResponse(w, "Invalid id", http.StatusBadRequest)
			return
		}
	}

	if filterId > 0 {
		users, err := DB.GetNotGroupMembers(username, filterId)

		if err != nil {
			GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		}

		w.WriteHeader(http.StatusAccepted)
		res, _ := json.Marshal(users)
		io.WriteString(w, string(res))

	} else {
		users, err := DB.GetAllUsers(username)

		if err != nil {
			GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		}

		w.WriteHeader(http.StatusAccepted)
		res, _ := json.Marshal(users)
		io.WriteString(w, string(res))
	}
}
