package handlers

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"
)

type PendingFollow struct {
	UserId       int  `json:"user_id"`
	CheckPending bool `json:"check_pending"`
}

type PendingResolve struct {
	UserId     int  `json:"user_id"`
	FollowerId int  `json:"follow_id"`
	Accepted   bool `json:"accept"`
}

func CheckFollow(w http.ResponseWriter, r *http.Request) {
	var err error

	params := r.URL.Query()

	filterUser := 0
	if userId, isExist := params["user_id"]; isExist {
		filterUser, err = strconv.Atoi(userId[0])
		if err != nil {
			GetErrResponse(w, "Invalid Id", http.StatusBadRequest)
			return
		}
	}

	if filterUser == 0 {
		username := IsUser(w, r)
		filterUser = DB.GetUserID(username)
	}

	userId := GetLoggedInUserID(w, r)

	w.WriteHeader(http.StatusOK)
	response := ResponseError{Status: RESPONSE_OK}
	if DB.NotFollowPrivate(userId, filterUser) {
		response.Error = "Yes"
	} else {
		response.Error = "No"
	}
	res, err := json.Marshal(response)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	io.WriteString(w, string(res))
}

func GetFollows(w http.ResponseWriter, r *http.Request) {
	var err error

	params := r.URL.Query()

	filterUser := 0
	if userId, isExist := params["user_id"]; isExist {
		filterUser, err = strconv.Atoi(userId[0])
		if err != nil {
			GetErrResponse(w, "Invalid Id", http.StatusBadRequest)
			return
		}
	}

	if filterUser == 0 {
		username := IsUser(w, r)
		filterUser = DB.GetUserID(username)
	}

	follows, err := DB.GetFollows(filterUser)

	if err != nil {
		GetErrResponse(w, "Error while getting follows", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
	res, err := json.Marshal(follows)
	if err != nil {
		GetErrResponse(w, "Error while marshaling follows", http.StatusInternalServerError)
		return
	}

	io.WriteString(w, string(res))
}

func ResolvePending(w http.ResponseWriter, r *http.Request) {
	var err error
	var pendingResolve PendingResolve

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		GetErrResponse(w, "Error while reading request body", http.StatusBadRequest)
		return
	}

	err = json.Unmarshal(body, &pendingResolve)
	if err != nil {
		GetErrResponse(w, "Error while unmarshaling json", http.StatusBadRequest)
		return
	}

	followerUser := DB.GetUser(pendingResolve.FollowerId)

	err = DB.ResolvePending(pendingResolve.UserId, followerUser, pendingResolve.Accepted)
	if err != nil {
		GetErrResponse(w, "Error while resolving pending", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := ResponseError{Status: RESPONSE_OK}
	res, err := json.Marshal(response)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	io.WriteString(w, string(res))
}

func ToggleFollow(w http.ResponseWriter, r *http.Request) {
	var err error
	var pendingFollow PendingFollow

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		GetErrResponse(w, "Error while reading request body", http.StatusBadRequest)
		return
	}

	err = json.Unmarshal(body, &pendingFollow)
	if err != nil {
		GetErrResponse(w, "Error while unmarshaling json", http.StatusBadRequest)
		return
	}

	userId := GetLoggedInUserID(w, r)
	followedUser := DB.GetUser(pendingFollow.UserId)

	if !pendingFollow.CheckPending {
		err, broadcast := DB.ToggleFollow(userId, followedUser)
		if err != nil {
			GetErrResponse(w, "Error while toggling follow", http.StatusInternalServerError)
			return
		}

		if broadcast {
			username, err := DB.GetUserName(userId)
			if err != nil {
				GetErrResponse(w, "Error while getting username", http.StatusInternalServerError)
				return
			}
			Mgr.broadcastFollowNotification(userId, followedUser.ID, username)
		}

		w.WriteHeader(http.StatusOK)
		response := ResponseError{Status: RESPONSE_OK, Error: "No checking pending"}
		res, err := json.Marshal(response)
		if err != nil {
			GetErrResponse(w, err.Error(), http.StatusInternalServerError)
			return
		}

		io.WriteString(w, string(res))
	} else {
		isPending, err := DB.CheckPending(userId, followedUser)
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
		res, err := json.Marshal(response)
		if err != nil {
			GetErrResponse(w, err.Error(), http.StatusInternalServerError)
			return
		}
		io.WriteString(w, string(res))
	}
}
