package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	db "socialnetwork/pkg/db/sqlite"
	"strconv"
	"strings"
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
		group, err := DB.GetGroup(filterId, userId)
		if err != nil {
			GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		}

		w.WriteHeader(http.StatusOK)
		res, err := json.Marshal(group)
		if err != nil {
			GetErrResponse(w, "Unable to marshal group", http.StatusInternalServerError)
		}

		io.WriteString(w, string(res))

	} else {
		groups, err := DB.GetAllGroups(userId)
		if err != nil {
			GetErrResponse(w, "Unable to get groups", http.StatusInternalServerError)
		}

		w.WriteHeader(http.StatusOK)
		res, err := json.Marshal(groups)
		if err != nil {
			GetErrResponse(w, "Unable to marshal groups", http.StatusInternalServerError)
		}
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
		AvatarUrl:   "/upload/group.png",
		ID:          int(groupId),
		IsMember:    true,
	}

	w.WriteHeader(http.StatusOK)
	res, err := json.Marshal(group)
	if err != nil {
		GetErrResponse(w, "Unable to marshal group", http.StatusInternalServerError)
	}

	io.WriteString(w, string(res))
}

func GroupJoin(w http.ResponseWriter, r *http.Request) {
	userId := GetLoggedInUserID(w, r)

	groupId, err := strconv.Atoi(r.FormValue("group_id"))

	if err != nil {
		GetErrResponse(w, "Invalid group id", http.StatusBadRequest)
		return
	}

	usersId := r.FormValue("users")

	//In this case it is invitation to the group
	if usersId != "" {
		users := strings.Split(usersId, ",")

		for _, item := range users {
			userId, err = strconv.Atoi(item)
			if err != nil {
				GetErrResponse(w, "Invalid user list", http.StatusBadRequest)
			}

			err = DB.JoinToGroup(userId, groupId, 0, 0)
			if err != nil {
				GetErrResponse(w, err.Error(), http.StatusInternalServerError)
			}
		}

		//In this case it is request to the group
	} else {
		err = DB.JoinToGroup(userId, groupId, 1, 0)

		if err != nil {
			GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		}
	}

	w.WriteHeader(http.StatusOK)
}

func EventAdd(w http.ResponseWriter, r *http.Request) {

	userID := GetLoggedInUserID(w, r)
	userName, err := DB.GetUserName(userID)
	if err != nil {
		GetErrResponse(w, "Invalid user id", http.StatusInternalServerError)
		return
	}

	err = r.ParseForm()
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

	occurTime, err := time.Parse("2006-01-02T15:04", occurTimeStr)
	if err != nil {
		GetErrResponse(w, "Invalid date", http.StatusBadRequest)
		return
	}

	eventId, err := DB.CreateEvent(userID, int(groupId), title, description, occurTime)

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	groupUsers, err := DB.GetGroupUserIds(int(groupId))
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	for _, groupUser := range groupUsers {
		DB.JoinToEvent(groupUser, int(eventId), 0, 0)
	}

	event := db.Event{
		ID:          int(eventId),
		CreatorId:   userID,
		CreatorName: userName,
		Name:        title,
		Description: description,
		OccurTime:   occurTime,
		VotedYes:    0,
		VotedNo:     0,
		UserVote:    -1,
	}

	w.WriteHeader(http.StatusOK)
	res, err := json.Marshal(event)
	if err != nil {
		GetErrResponse(w, "Unable to marshal event", http.StatusInternalServerError)
	}

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
	res, err := json.Marshal(event)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	io.WriteString(w, string(res))
}

func EventUpdate(w http.ResponseWriter, r *http.Request) {
	userID := GetLoggedInUserID(w, r)

	err := r.ParseForm()
	if err != nil {
		GetErrResponse(w, "Parsing form failed", http.StatusBadRequest)
		return
	}

	notificationType := r.FormValue("type")

	groupId, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		GetErrResponse(w, "Invalid group", http.StatusBadRequest)
		return
	}

	isAccepted := r.FormValue("is_accepted") == "true"

	switch notificationType {
	case INVITENOTIFICATION_TYPE:
		{
			if isAccepted {
				err = DB.JoinToEventsInGroup(userID, groupId)
				if err != nil {
					GetErrResponse(w, "Failed to join to group events", http.StatusInternalServerError)
					return
				}
			}
		}
	case JOINREQNOTIFICATION_TYPE:
		{
			creatorId, err := DB.GetGroupCreatorId(groupId)

			if err != nil {
				GetErrResponse(w, "Invalid group", http.StatusBadRequest)
				return
			}

			if creatorId != userID {
				GetErrResponse(w, "Invalid group", http.StatusBadRequest)
				return
			}

			userId, err := strconv.Atoi(r.FormValue("user_id"))
			if err != nil {
				GetErrResponse(w, "Invalid user", http.StatusBadRequest)
				return
			}

			if isAccepted {
				err = DB.JoinToEventsInGroup(userId, groupId)
				if err != nil {
					GetErrResponse(w, "Failed to join to group events", http.StatusInternalServerError)
					return
				}
			}
		}
	}
}
