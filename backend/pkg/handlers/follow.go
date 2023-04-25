package handlers

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	db "socialnetwork/backend/pkg/db/sqlite"
	"strconv"
)

type PendingFollow struct {
	User         db.User `json:"user"`
	CheckPending bool    `json:"check_pending"`
}

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
		GetErrResponse(w, "Invalid Id", http.StatusBadRequest)
		return
	}

	follows, err := DB.GetFollows(filterUser)

	if err != nil {
		GetErrResponse(w, "Error while getting follows", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
	res, _ := json.Marshal(follows)
	io.WriteString(w, string(res))
}

func ToggleFollow(w http.ResponseWriter, r *http.Request) {
	var err error
	var pendingFollow PendingFollow

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		GetErrResponse(w, "Invalid Id", http.StatusBadRequest)
		return
	}

	err = json.Unmarshal(body, &pendingFollow)
	if err != nil {
		GetErrResponse(w, "Invalid Id", http.StatusBadRequest)
		return
	}

	userId := GetLoggedInUserID(w, r)

	if !pendingFollow.CheckPending {
		err = DB.ToggleFollow(userId, pendingFollow.User)
		if err != nil {
			GetErrResponse(w, "Error while toggling follow", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		response := ResponseError{Status: RESPONSE_OK}
		res, _ := json.Marshal(response)
		io.WriteString(w, string(res))
	} else {
		isPending, err := DB.CheckPending(userId, pendingFollow.User)
		if err != nil {
			GetErrResponse(w, "Error while checking pending", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		response := ResponseError{Status: RESPONSE_OK}
		if isPending {
			response.Error = "Pending"
		} else {
			response.Error = "No pending"
		}
		res, _ := json.Marshal(response)
		io.WriteString(w, string(res))
	}
}
