package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	db "socialnetwork/backend/pkg/db/sqlite"
	"strconv"
	"time"
)

func GroupGet(w http.ResponseWriter, r *http.Request) {
	userId := GetLoggedInUserID(w, r)

	params := r.URL.Query()

	var err error
	filterId := 0

	if paramsId, isExist := params["id"]; isExist {
		filterId, err = strconv.Atoi(paramsId[0])
		if err != nil {
			GetErrResponse(w, "Invalid id", http.StatusBadRequest)
			return
		}
	}

	if filterId > 0 {
		//todo error + 404
		group, _ := DB.GetGroup(filterId, userId)

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

	err = DB.JoinToGroup(userId, groupId, 1, 0)

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusOK)
}

func EventAdd(w http.ResponseWriter, r *http.Request) {

	userID := GetLoggedInUserID(w, r)

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

	title := r.FormValue("title")
	description := r.FormValue("description")
	occurTimeStr := r.FormValue("occur_date")

	occurTime, _ := time.Parse("2006-01-02T15:04", occurTimeStr)

	eventId, err := DB.CreateEvent(userID, int(groupId), title, description, occurTime)

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	groupUsers, err := DB.GetGroupUserIds(groupId)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	for groupUser := range groupUsers {
		DB.JoinToEvent(groupUser, int(eventId), 0, 0)
	}

	event := db.Event{
		ID:          int(eventId),
		CreatorId:   userID,
		Name:        title,
		Description: description,
		OccurTime:   occurTime,
		VotedYes:    0,
		VotedNo:     0,
		UserVote:    -1,
	}

	w.WriteHeader(http.StatusOK)
	res, _ := json.Marshal(event)
	io.WriteString(w, string(res))
}

func EventJoin(w http.ResponseWriter, r *http.Request) {

	userId := GetLoggedInUserID(w, r)

	err := r.ParseForm()
	if err != nil {
		GetErrResponse(w, "Parsing form failed", http.StatusBadRequest)
		return
	}

	eventId, err := strconv.Atoi(r.FormValue("event_id"))

	if err != nil {
		GetErrResponse(w, "Invalid event id", http.StatusBadRequest)
		return
	}

	isGoing, err := strconv.Atoi(r.FormValue("is_going"))

	if err != nil {
		GetErrResponse(w, "Invalid vote value", http.StatusBadRequest)
		return
	}

	err = DB.JoinToEvent(userId, eventId, 1, isGoing)

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	event := db.Event{
		ID: eventId,
	}

	event.VotedYes, event.VotedNo, event.UserVote, err = DB.GetVotes(eventId, userId)

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusOK)
	res, _ := json.Marshal(event)
	io.WriteString(w, string(res))
}
