package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	db "socialnetwork/backend/pkg/db/sqlite"
	"strconv"
)

type Notifications struct {
	GroupInvitations []db.Group `json:"group_invitations"`
	GroupRequests    []db.Group `json:"group_requests"`
}

func GetNotifications(w http.ResponseWriter, r *http.Request) {

	userId := GetLoggedInUserID(w, r)

	var err error
	notifications := Notifications{}

	notifications.GroupInvitations, err = DB.GetGroupInvitations(userId)

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	userGroups, _ := DB.GetCreatorGroups(userId)

	for _, group := range userGroups {
		groupRequests, _ := DB.GetGroupRequests(group.ID)

		group.Members = groupRequests

		notifications.GroupRequests = append(notifications.GroupRequests, group)
	}

	w.WriteHeader(http.StatusOK)
	res, _ := json.Marshal(notifications)
	io.WriteString(w, string(res))
}

func ReplyNotifications(w http.ResponseWriter, r *http.Request) {
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
			DB.ReplyOnGroupInvitation(userID, groupId, isAccepted)
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

			DB.ReplyOnGroupInvitation(userId, groupId, isAccepted)
		}
	}
}