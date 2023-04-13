package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
)

func CommentGet(w http.ResponseWriter, r *http.Request) {
	var err error
	var postId int

	params := r.URL.Query()

	if id, isExist := params["post_id"]; isExist {
		postId, err = strconv.Atoi(id[0])
	}

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	} else {
		comments, _ := DB.GetCommentsByPost(postId)

		w.WriteHeader(http.StatusAccepted)

		res, _ := json.Marshal(comments)
		io.WriteString(w, string(res))
	}
}

func CommentAdd(w http.ResponseWriter, r *http.Request) {

	if !IsOn(w, r) {
		GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	username := IsUser(w, r)
	user_id := DB.GetUserID(username)

	err := r.ParseForm()
	if err != nil {
		GetErrResponse(w, "PARSING FORM FAILED", http.StatusInternalServerError)
		return
	}

	comment := r.FormValue("comment")
	postID, _ := strconv.Atoi(r.FormValue("postId"))
	img_url := r.FormValue("img_url")
	// HANDLE ERROR
	commentErrorCheck, commentErrorMessage := ValidateField("comment", comment, 1, 1000)

	if commentErrorCheck {
		GetErrResponse(w, commentErrorMessage, http.StatusBadRequest)
		return
	}

	commentDB := DB.CreateComment(user_id, postID, comment, username, img_url)
	res, _ := json.Marshal(commentDB)
	io.WriteString(w, string(res))

}
