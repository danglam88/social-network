package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
)

const MAX_SIZE = 50000000
const MAX_SIZE_AVATAR = 5000000

func GetVisiblePosts(w http.ResponseWriter, r *http.Request) {
	var err error

	params := r.URL.Query()

	filterUser := 0

	if userId, isExist := params["creator_id"]; isExist {
		filterUser, err = strconv.Atoi(userId[0])
	}

	if err != nil {
		GetErrResponse(w, "Invalid Id", http.StatusBadRequest)
		return
	}

	userId := GetLoggedInUserID(w, r)

	posts, err := DB.GetVisiblePosts(userId, filterUser)
	if err != nil {
		GetErrResponse(w, "Error while getting posts", http.StatusBadRequest)
		return
	}
	for i := range posts {
		posts[i].Content = strings.ReplaceAll(posts[i].Content, "\r\n", "<br>")
	}
	//sort posts reversed
	for i, j := 0, len(posts)-1; i < j; i, j = i+1, j-1 {
		posts[i], posts[j] = posts[j], posts[i]
	}

	w.WriteHeader(http.StatusAccepted)
	res, _ := json.Marshal(posts)
	io.WriteString(w, string(res))
}

// function to get all posts per profile- or group page
func PostGet(w http.ResponseWriter, r *http.Request) {
	var err error

	//fmt.Println(ValidateField("content", " hello!<br> ", 1, 100))

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
		GetErrResponse(w, "Invalid Id", http.StatusBadRequest)
		return
	}

	posts, err := DB.GetPosts(filterUser, filterGroup)
	if err != nil {
		GetErrResponse(w, "Error while getting posts", http.StatusBadRequest)
		return
	}
	for i := range posts {
		posts[i].Content = strings.ReplaceAll(posts[i].Content, "\r\n", "<br>")
	}
	//sort posts reversed
	for i, j := 0, len(posts)-1; i < j; i, j = i+1, j-1 {
		posts[i], posts[j] = posts[j], posts[i]
	}

	w.WriteHeader(http.StatusAccepted)
	res, _ := json.Marshal(posts)
	io.WriteString(w, string(res))
}

func PostAdd(w http.ResponseWriter, r *http.Request) {
	username := IsUser(w, r)
	creatorID := DB.GetUserID(username)
	groupID := 0

	err := r.ParseMultipartForm(MAX_SIZE)
	if err != nil {
		GetErrResponse(w, "PARSING FORM FAILED", http.StatusInternalServerError)
		return
	}

	visibility := r.FormValue("visibility")
	visibilityNbr := 0
	if visibility == "allmembers" {
		visibilityNbr = 1
	} else if visibility == "superprivate" {
		visibilityNbr = 2
	}

	followersID := []int{}
	if visibility == "superprivate" {
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

	groupIDvalue := r.FormValue("group_id")
	if groupIDvalue != "" {
		groupID, err = strconv.Atoi(groupIDvalue)
		if err != nil {
			GetErrResponse(w, "Invalid group id format", http.StatusBadRequest)
			return
		}
		if groupID != 0 && !DB.IsMember(creatorID, groupID) {
			w.WriteHeader(http.StatusOK)
			response := ResponseError{Status: RESPONSE_ERR, Error: "You are not a member of this group"}
			res, _ := json.Marshal(response)
			io.WriteString(w, string(res))
			return
		}
	}

	imgUrl, imgErr := UploadFile(w, r, false)
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
	postID, postErr := DB.CreatePost(creatorID, groupID, visibilityNbr, title, content, imgUrl)
	if postErr != nil {
		GetErrResponse(w, postErr.Error(), http.StatusBadRequest)
		return
	}

	if visibility == "superprivate" {
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

	words := strings.Fields(field)
	if len(words) > 0 {
		for _, word := range words {
			if len(word) > 30 {
				errorMessage = fmt.Sprintf("%v can not contain words longer than 30 characters", fieldName)
				errorCheck = true
			}
		}
	}

	//check if content only include spaces and/or tabs
	if !errorCheck {
		remove_space := strings.TrimSpace(field)
		remove_tab := strings.Trim(remove_space, "\t")
		if len(remove_tab) == 0 {
			errorMessage = fieldName + " name can not contain only spaces or newlines"
			errorCheck = true
		}
	}
	regexTag := regexp.MustCompile("<[^>]*>")
	if !errorCheck && regexTag.MatchString(field) {
		errorMessage = fieldName + " can not contain html tags"
		errorCheck = true
	}

	regex := regexp.MustCompile(`^[\p{L}\p{N}\p{P}\p{S}\p{Z}\p{Sm}\p{Sc}\x{1F600}-\x{1F64F}\x{1F300}-\x{1F5FF}\x{1F680}-\x{1F6FF}\x{1F1E0}-\x{1F1FF}\r\n]+$`)
	if !errorCheck && !regex.MatchString(field) {
		errorMessage = fieldName + " can only contain letters, numbers, special characters, and emojis"
		errorCheck = true
	}

	return errorCheck, errorMessage
}

// Function to upload a file
func UploadFile(w http.ResponseWriter, r *http.Request, isAvatar bool) (imgUrl string, err error) {
	file, handler, err := r.FormFile("picture")
	if err == http.ErrMissingFile {
		return imgUrl, nil
	}
	if err != nil {
		return imgUrl, err
	}
	defer file.Close()
	//fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	//fmt.Printf("File Size: %+v\n", handler.Size)
	//fmt.Printf("MIME Header: %+v\n", handler.Header)
	if (isAvatar && handler.Size > MAX_SIZE_AVATAR) || (!isAvatar && handler.Size > MAX_SIZE) {
		return imgUrl, errors.New("max size is 50MB")
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
	if filetype != "image/jpeg" && filetype != "image/jpg" && filetype != "image/png" && filetype != "image/gif" &&
		!(headerFiletype == "image/svg+xml" && (strings.Contains(filetype, "text/xml") || strings.Contains(filetype, "text/plain;"))) {
		return imgUrl, errors.New("invalid type, allowed types : jpeg, jpg, png, gif, svg")
	}
	fileNameSlice := strings.Split(handler.Filename, ".")
	extension := fileNameSlice[len(fileNameSlice)-1]
	os.Mkdir("upload", 0744)
	// Create a temporary file within our upload directory that follows
	// a particular naming pattern
	time := time.Now().Local().Format("2006-01-02_15:04:05")
	time = strings.Replace(time, ":", "-", -1)
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
