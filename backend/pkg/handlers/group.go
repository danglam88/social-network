package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	db "socialnetwork/backend/pkg/db/sqlite"
	"strconv"
)

func GroupGet(w http.ResponseWriter, r *http.Request) {

	if !IsOn(w, r) {
		GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	userId := GetLoggedInUserID(w, r)

	params := r.URL.Query()

	var err error
	filterId := 0

	if paramsId, isExist := params["id"]; isExist {
		filterId, err = strconv.Atoi(paramsId[0])

		if err != nil {
			//todo err validation
		}
	}

	if filterId > 0 {
		//todo error + 404
		group, _ := DB.GetGroup(filterId)

		w.WriteHeader(http.StatusOK)
		res, _ := json.Marshal(group)
		io.WriteString(w, string(res))

	} else {
		groups, err := DB.GetAllGroups(userId)
		if err != nil {
			GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		}

		w.WriteHeader(http.StatusOK)
		res, _ := json.Marshal(groups)
		io.WriteString(w, string(res))
	}
}

func GroupAdd(w http.ResponseWriter, r *http.Request) {

	if !IsOn(w, r) {
		GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	userID := GetLoggedInUserID(w, r)

	err := r.ParseForm()
	if err != nil {
		GetErrResponse(w, "Parsing form failed", http.StatusBadRequest)
		return
	}

	title := r.FormValue("title")
	description := r.FormValue("description")

	groupId, err := DB.CreateGroup(userID, title, description)

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	err = DB.JoinToGroup(userID, int(groupId))

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	group := db.Group{
		CreatorId:   userID,
		GroupName:   title,
		Description: description,
		ID:          int(groupId),
		IsMember:    true,
	}

	w.WriteHeader(http.StatusOK)
	res, _ := json.Marshal(group)
	io.WriteString(w, string(res))
}

func GroupJoin(w http.ResponseWriter, r *http.Request) {

	if !IsOn(w, r) {
		GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	userId := GetLoggedInUserID(w, r)

	err := r.ParseForm()
	if err != nil {
		GetErrResponse(w, "Parsing form failed", http.StatusBadRequest)
		return
	}

	groupId, err := strconv.Atoi(r.FormValue("group_id"))

	if err != nil {
		GetErrResponse(w, "Invalid group id", http.StatusBadRequest)
		return
	}

	err = DB.JoinToGroup(userId, groupId)

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusOK)
}
