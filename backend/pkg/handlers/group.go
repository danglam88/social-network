package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
)

func GroupGet(w http.ResponseWriter, r *http.Request) {
	// if !IsOn(w, r) {
	// 	GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
	// 	return
	// }

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

		groups, err := DB.GetAllGroups()
		if err != nil {
			GetErrResponse(w, err.Error(), http.StatusInternalServerError)
		}

		w.WriteHeader(http.StatusOK)
		res, _ := json.Marshal(groups)
		io.WriteString(w, string(res))
	}
}

func GroupAdd(w http.ResponseWriter, r *http.Request) {
	//parse form
	err := r.ParseForm()
	if err != nil {
		GetErrResponse(w, "Parsing form failed", http.StatusBadRequest)
		return
	}

	title := r.FormValue("title")
	description := r.FormValue("description")

	//todo temp creator
	groupId, err := DB.CreateGroup(1, title, description)

	fmt.Println(groupId)

}
