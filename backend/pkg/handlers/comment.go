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
	userMail := IsUser(w, r)
	userId := DB.GetUserID(userMail)

	err := r.ParseMultipartForm(MAX_SIZE)
	if err != nil {
		GetErrResponse(w, "PARSING FORM FAILED", http.StatusInternalServerError)
		return
	}

	comment := r.FormValue("content")
	postID, _ := strconv.Atoi(r.FormValue("post_id"))
	imgUrl, imgErr := UploadFile(w, r)
	if imgErr != nil {
		GetErrResponse(w, "Invalid image", http.StatusBadRequest)
		return
	}
	// HANDLE ERROR
	commentErrorCheck, commentErrorMessage := ValidateField("Content", comment, 1, 1000)

	if commentErrorCheck {
		GetErrResponse(w, commentErrorMessage, http.StatusBadRequest)
		return
	}

	commentDB := DB.CreateComment(userId, postID, comment, imgUrl)

	res, _ := json.Marshal(commentDB)
	io.WriteString(w, string(res))

}

//creator_id,post_id,content,created_at,img_url
