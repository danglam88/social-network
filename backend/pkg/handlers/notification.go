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
}

func GetNotifications(w http.ResponseWriter, r *http.Request) {

	userId := GetLoggedInUserID(w, r)

	var err error
	notifications := Notifications{}

	notifications.GroupInvitations, err = DB.GetGroupInvitations(userId)

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
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

	isAccepted := r.FormValue("is_accepted") == "true"

	switch notificationType {
	case INVITENOTIFICATION_TYPE:
		{
			groupId, err := strconv.Atoi(r.FormValue("group_id"))
			if err != nil {
				GetErrResponse(w, "Parsing form failed", http.StatusBadRequest)
				return
			}

			DB.ReplyOnGroupInvitation(userID, groupId, isAccepted)
		}
	case EVENTNOTIFICATION_TYPE:
		{

		}
	case JOINREQNOTIFICATION_TYPE:
		{

		}
	}
}
