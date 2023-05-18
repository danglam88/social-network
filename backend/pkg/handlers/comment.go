package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func CommentGet(w http.ResponseWriter, r *http.Request) {
	var err error
	var postId int

	params := r.URL.Query()

	if id, isExist := params["post_id"]; isExist {
		postId, err = strconv.Atoi(id[0])
	}

	if err != nil {
		GetErrResponse(w, "Invalid id", http.StatusBadRequest)
		return
	}

	comments, err := DB.GetCommentsByPost(postId)
	if err != nil {
		log.Println(err)
		return
	}
	for i := range comments {
		comments[i].Content = strings.ReplaceAll(comments[i].Content, "\r\n", "<br>")
	}

	w.WriteHeader(http.StatusAccepted)
	res, err := json.Marshal(comments)
	if err != nil {
		log.Println(err)
		return
	}
	io.WriteString(w, string(res))
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
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		GetErrResponse(w, "Invalid post id", http.StatusBadRequest)
		return
	}

	groupID, creatorID, err := DB.GetGroupIdAndCreatorIdFromPostId(postID)
	if err != nil {
		GetErrResponse(w, "Invalid post id", http.StatusBadRequest)
		return
	}
	creatorStruct := DB.GetUser(creatorID)
	if groupID != 0 && !DB.IsMember(userId, groupID) {
		w.WriteHeader(http.StatusOK)
		response := ResponseError{Status: RESPONSE_ERR, Error: "You are not a member of this group"}
		res, err := json.Marshal(response)
		if err != nil {
			log.Println(err)
			return
		}

		io.WriteString(w, string(res))
		return

	} else if groupID == 0 && !DB.IsFollower(userId, creatorID) && creatorStruct.IsPrivate == 1 && creatorID != userId {
		w.WriteHeader(http.StatusOK)
		response := ResponseError{Status: RESPONSE_ERR, Error: "You are not a follower of this private user"}
		res, err := json.Marshal(response)
		if err != nil {
			log.Println(err)
			return
		}
		io.WriteString(w, string(res))
		return
	}

	// HANDLE ERROR
	commentErrorCheck, commentErrorMessage := ValidateField("Content", comment, 1, 1000)

	if commentErrorCheck && len(comment) > 0 {
		GetErrResponse(w, commentErrorMessage, http.StatusBadRequest)
		return
	}

	imgUrl, imgErr := UploadFile(w, r, false)
	if imgErr != nil {
		GetErrResponse(w, "Invalid image", http.StatusBadRequest)
		return
	}
	if len(imgUrl) == 0 && len(comment) == 0 {
		GetErrResponse(w, "You must add content or picture", http.StatusBadRequest)
		return
	}

	commentDB := DB.CreateComment(userId, postID, comment, imgUrl)

	res, err := json.Marshal(commentDB)
	if err != nil {
		log.Println(err)
		return
	}
	io.WriteString(w, string(res))
}
