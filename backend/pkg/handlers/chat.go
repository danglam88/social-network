package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	db "socialnetwork/pkg/db/sqlite"
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
	history, chatId, created, err := DB.GetHistory(groupId, user_id, to, page)
	if err != nil {
		if err.Error() != "not allowed to send message to this user" {
			GetErrResponse(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		response := ResponseError{Status: err.Error()}
		res, err := json.Marshal(response)
		if err != nil {
			GetErrResponse(w, err.Error(), http.StatusInternalServerError)
			return
		}
		io.WriteString(w, string(res))
		return

	}

	w.WriteHeader(http.StatusAccepted)

	type Response struct {
		ChatId  int          `json:"chat_id"`
		Created bool         `json:"created"`
		History []db.Message `json:"history"`
	}

	res, err := json.Marshal(Response{ChatId: chatId, Created: created, History: history})

	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	io.WriteString(w, string(res))
}

func GetAllChat(w http.ResponseWriter, r *http.Request) {
	username := IsUser(w, r)
	userId := DB.GetUserID(username)

	chats, err := DB.GetAllChats(userId)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	res, err := json.Marshal(chats)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	io.WriteString(w, string(res))
}

func CheckChat(w http.ResponseWriter, r *http.Request) {
	var err error

	params := r.URL.Query()

	filterUser := 0
	filterGroup := 0

	if userId, isExist := params["user_id"]; isExist {
		filterUser, err = strconv.Atoi(userId[0])
	}

	if groupId, isExist := params["group_id"]; isExist {
		filterGroup, err = strconv.Atoi(groupId[0])
	}

	if err != nil {
		GetErrResponse(w, "Invalid Id", http.StatusBadRequest)
		return
	}

	userId := GetLoggedInUserID(w, r)

	chatId, err := DB.GetChat(filterGroup, userId, filterUser)
	if err != nil {
		GetErrResponse(w, "Error while getting chat", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := ResponseError{Status: RESPONSE_OK}
	if chatId <= 0 {
		response.Error = "Chat not found"
	} else {
		response.Error = "Chat found"
	}
	res, err := json.Marshal(response)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	io.WriteString(w, string(res))
}
