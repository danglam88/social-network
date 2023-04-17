package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

const MAX_SIZE = 20971520

// function to get all posts per profile- or group page
func PostGet(w http.ResponseWriter, r *http.Request) {

	var err error

	params := r.URL.Query()

	filterUser := 0
	filterGroup := 0

	if userId, isExist := params["creator_id"]; isExist {
		filterUser, err = strconv.Atoi(userId[0])
	}

	if groupId, isExist := params["group_id"]; isExist {
		filterGroup, err = strconv.Atoi(groupId[0])
	}

	if err != nil {
		errorMess := "Invalid Id"
		GetErrResponse(w, errorMess, http.StatusBadRequest)
		return
	} else {
		posts, err := DB.GetPosts(filterUser, filterGroup)
		if err != nil {
			errorMess := "Error while getting posts"
			GetErrResponse(w, errorMess, http.StatusBadRequest)
			return
		}

		w.WriteHeader(http.StatusAccepted)
		res, _ := json.Marshal(posts)
		io.WriteString(w, string(res))
	}
}

func PostAdd(w http.ResponseWriter, r *http.Request) {

	if !IsOn(w, r) {
		GetErrResponse(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	username := IsUser(w, r)
	creatorID := DB.GetUserID(username)

	err := r.ParseForm()
	if err != nil {
		GetErrResponse(w, "PARSING FORM FAILED", http.StatusInternalServerError)
		return
	}

	groupID, groupErr := strconv.Atoi(r.FormValue("group_id"))
	if groupErr != nil {
		GetErrResponse(w, "Invalid group id", http.StatusBadRequest)
		return
	}
	visibility, visErr := strconv.Atoi(r.FormValue("visibility"))
	if visErr != nil {
		GetErrResponse(w, "Invalid privacy", http.StatusBadRequest)
		return
	}
	followersID := []int{}
	if visibility == 2 {
		followersID = append(followersID, creatorID)
		//fetch chosen users from form, add their ids to followers
		followers := strings.Split(r.FormValue("allowed_followers"), ",")
		for _, follower := range followers {
			followerID, err := strconv.Atoi(follower)
			if err != nil {
				GetErrResponse(w, "Invalid follower id", http.StatusBadRequest)
				return
			}
			followersID = append(followersID, followerID)
		}
	}

	imgUrl, imgErr := UploadFile(w, r)
	if imgErr != nil {
		GetErrResponse(w, "Invalid image", http.StatusBadRequest)
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
	//id,creator_id,group_id,visibility,title,content,created_at,img_url
	postID, postErr := DB.CreatePost(creatorID, groupID, visibility, title, content, imgUrl)
	if postErr != nil {
		GetErrResponse(w, postErr.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println("PostID: ", postID)

	if visibility == 2 {
		for _, followerID := range followersID {
			postVisiblyErr := DB.CreatePostFollower(postID, followerID)
			if postVisiblyErr != nil {
				GetErrResponse(w, postVisiblyErr.Error(), http.StatusBadRequest)
				return
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

// Function to upload a file
func UploadFile(w http.ResponseWriter, r *http.Request) (imgUrl string, err error) {
	file, handler, err := r.FormFile("uploaded_img")
	if err == http.ErrMissingFile {
		return imgUrl, nil
	}
	if err != nil {
		return imgUrl, err
	}
	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)
	if handler.Size > MAX_SIZE {
		return imgUrl, errors.New("max size is 20Mb")
	}
	// Detect content type of file
	headerFiletype := handler.Header.Get("Content-Type")
	// read all of the contents of our uploaded file into a
	// byte array
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		return imgUrl, err
	}
	filetype := http.DetectContentType(fileBytes)
	if filetype != "image/jpeg" && filetype != "image/png" && filetype != "image/gif" &&
		!(headerFiletype == "image/svg+xml" && (strings.Contains(filetype, "text/xml") || strings.Contains(filetype, "text/plain;"))) {
		return imgUrl, errors.New("invalid type, allowed types : jpeg, png, gif, svg")
	}
	fileNameSlice := strings.Split(handler.Filename, ".")
	extension := fileNameSlice[len(fileNameSlice)-1]
	os.Mkdir("upload", 0744)
	// Create a temporary file within our upload directory that follows
	// a particular naming pattern
	time := time.Now().Local().Format("2006-01-02_15:04:05")
	tempPattern := "*_" + time + "." + extension
	tempFile, err := ioutil.TempFile("upload", tempPattern)
	if err != nil {
		return imgUrl, err
	}
	defer tempFile.Close()
	// write this byte array to our temporary file
	tempFile.Write(fileBytes)
	imgUrl = "/" + tempFile.Name()
	// return that we have successfully uploaded our file!
	fmt.Println("Successfully Uploaded File")
	return imgUrl, nil
}
