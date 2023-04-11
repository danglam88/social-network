package handlers

import (
	"encoding/json"
	"fmt"
	"forum/db"
	"io"
	"net/http"
	"strconv"
	"strings"
)

func PostGet(w http.ResponseWriter, r *http.Request) {

	var err error

	params := r.URL.Query()

	filter := db.PostFilter{}

	if id, isExist := params["id"]; isExist {
		filter.ID, err = strconv.Atoi(id[0])
	}

	if categoryId, isExist := params["category_id"]; isExist {
		filter.CategoryID, err = strconv.Atoi(categoryId[0])
	}

	if err != nil {
		errorMess := "Invalid category Id"
		GetErrResponse(w, errorMess, http.StatusBadRequest)
		return
	} else {
		post, err := DB.GetPost(filter)
		if err != nil {
			errorMess := "Error while getting post"
			GetErrResponse(w, errorMess, http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusAccepted)
		res, _ := json.Marshal(post)
		io.WriteString(w, string(res))
	}
}

func PostAdd(w http.ResponseWriter, r *http.Request) {

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

	title := r.FormValue("title")
	ErrorCheck, TitleErrorMessage := ValidateField("Title", title, 1, 30)
	if ErrorCheck {
		GetErrResponse(w, TitleErrorMessage, http.StatusBadRequest)
		return
	}

	content := r.FormValue("content")
	descriptionErrorCheck, DescriptionErrorMessage := ValidateField("Content", content, 1, 3000)

	if descriptionErrorCheck {
		GetErrResponse(w, DescriptionErrorMessage, http.StatusBadRequest)
		return
	}

	//Check if user has selected a category
	list := r.Form["category"]

	for _, v := range list {
		category_id := DB.GetCategoryID(v)
		//check if category exists
		if category_id < 1 {
			GetErrResponse(w, "Category does not exist", http.StatusBadRequest)
			return
		}
	}
	if len(list) < 1 {
		GetErrResponse(w, "No category selected", http.StatusBadRequest)
		return
	}

	postID, postErr := DB.CreatePost(user_id, title, content)
	if postErr != nil {
		GetErrResponse(w, postErr.Error(), http.StatusBadRequest)
		return
	} else {
		for _, v := range list {
			//get category id
			category_id := DB.GetCategoryID(v)
			//set category relation
			if category_id > 0 {
				DB.SetCategoryRelation(int(postID), category_id)
			}
		}
	}

	w.WriteHeader(http.StatusOK)
	response := ResponseError{Status: RESPONSE_OK}
	res, _ := json.Marshal(response)
	io.WriteString(w, string(res))
}

func ValidateField(fieldName, field string, minLength, maxLength int) (errorCheck bool, errorMessage string) {
	errorCheck = false

	if len(field) < minLength || len(field) > maxLength {
		errorMessage = fmt.Sprintf("%v length should be between %d - %d", fieldName, minLength, maxLength)
		errorCheck = true
	}

	//check if content only include spaces and/or tabs
	if !errorCheck {
		remove_space := strings.TrimSpace(field)
		remove_tab := strings.Trim(remove_space, "\t")
		if len(remove_tab) == 0 {
			errorMessage = fieldName + " name can not contain only space(s)"
			errorCheck = true
		}
	}

	return errorCheck, errorMessage
}
