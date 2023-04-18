package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
)

func GetHistory(w http.ResponseWriter, r *http.Request) {

	params := r.URL.Query()

	var groupId, to, page int
	var err error

	if !IsOn(w, r) {
		GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	username := IsUser(w, r)
	user_id := DB.GetUserID(username)

	if toStr, isToExist := params["to"]; isToExist {
		to, err = strconv.Atoi(toStr[0])
	} else {
		GetErrResponse(w, "to is mandatory", http.StatusBadRequest)
		return
	}

	if groupStr, isGroupExist := params["group_id"]; isGroupExist {
		groupId, err = strconv.Atoi(groupStr[0])
	} else {
		GetErrResponse(w, "group_id is mandatory", http.StatusBadRequest)
		return
	}

	if pageStr, isPageExist := params["page"]; isPageExist {
		page, err = strconv.Atoi(pageStr[0])
	} else {
		GetErrResponse(w, "page is mandatory", http.StatusBadRequest)
		return
	}

	history, err := DB.GetHistory(groupId, user_id, to, page)
	if err != nil {
		GetErrResponse(w, err.Error(), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusAccepted)
	res, _ := json.Marshal(history)
	io.WriteString(w, string(res))
}

/*func GetUsers(w http.ResponseWriter, r *http.Request) {

	if !IsOn(w, r) {
		GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
		return
	}

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

	if !IsOn(w, r) {
		fmt.Println("failed here: chat.go:81")
		GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
		return
	}
	fmt.Println("passed here: chat.go:85")

	username := IsUser(w, r)
	userId := DB.GetUserID(username)

	chats, _ := DB.GetAllChats(userId)

	w.WriteHeader(http.StatusOK)
	res, _ := json.Marshal(chats)
	io.WriteString(w, string(res))
}
