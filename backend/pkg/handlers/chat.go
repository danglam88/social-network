package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	db "socialnetwork/backend/pkg/db/sqlite"
	"strconv"
)

func GetHistory(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()

	var groupId, to, page int
	var err error

	username := IsUser(w, r)
	user_id := DB.GetUserID(username)

	if groupStr, isGroupExist := params["group_id"]; isGroupExist {
		groupId, err = strconv.Atoi(groupStr[0])
		if err != nil {
			GetErrResponse(w, "Invalid group_id", http.StatusBadRequest)
			return
		}
	} else {
		GetErrResponse(w, "group_id is mandatory", http.StatusBadRequest)
		return
	}

	if groupId == 0 {
		if toStr, isToExist := params["to"]; isToExist {
			to, err = strconv.Atoi(toStr[0])
			if err != nil {
				GetErrResponse(w, "Invalid to", http.StatusBadRequest)
				return
			}
		} else {
			GetErrResponse(w, "to is mandatory", http.StatusBadRequest)
			return
		}
	}

	if pageStr, isPageExist := params["page"]; isPageExist {
		page, err = strconv.Atoi(pageStr[0])
		if err != nil {
			GetErrResponse(w, "Invalid page", http.StatusBadRequest)
			return
		}
	} else {
		GetErrResponse(w, "page is mandatory", http.StatusBadRequest)
		return
	}

	history, chatId, err := DB.GetHistory(groupId, user_id, to, page)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)

	type Response struct {
		ChatId  int          `json:"chat_id"`
		History []db.Message `json:"history"`
	}

	res, err := json.Marshal(Response{ChatId: chatId, History: history})

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	io.WriteString(w, string(res))
}

/*func GetUsers(w http.ResponseWriter, r *http.Request) {
	username := IsUser(w, r)
	userId := DB.GetUserID(username)

	users, _ := DB.GetUsers(userId)

	for i, user := range users {
		(users[i]).Status = UserLoggedIn(user.UserName)
	}

	w.WriteHeader(http.StatusOK)
	res, _ := json.Marshal(users)
	io.WriteString(w, string(res))
}*/

func GetAllChat(w http.ResponseWriter, r *http.Request) {
	username := IsUser(w, r)
	userId := DB.GetUserID(username)

	chats, _ := DB.GetAllChats(userId)

	w.WriteHeader(http.StatusOK)
	res, _ := json.Marshal(chats)
	io.WriteString(w, string(res))
}
