package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type DataValidation struct {
	Field   string
	Message string
}

type ValidationJson struct {
	Status int
	Data   []DataValidation
}

func RegisterPost(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(MAX_SIZE); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	email := r.FormValue("email")
	password := r.FormValue("password")
	repassword := r.FormValue("password2")
	firstName := r.FormValue("firstName")
	lastName := r.FormValue("lastName")
	birth := r.FormValue("dateOfBirth")
	username := r.FormValue("nickname")
	about := r.FormValue("aboutMe")
	ImgUrl, imgErr := UploadFile(w, r, true)
	if imgErr != nil {
		fmt.Println(imgErr)
	}
	if ImgUrl == "" {
		ImgUrl = SetRandomAvatar()
	}

	json, status := validateForm(email, password, repassword, firstName, lastName, birth, ImgUrl, username, about)
	// fmt.Println(string(json))
	w.WriteHeader(status)
	io.WriteString(w, string(json))
}

func addUsertoJson(user []DataValidation, status int) []byte {
	var finalJson []ValidationJson
	if status == 200 {
		finalJson = append(finalJson, ValidationJson{Status: status})
	} else {
		finalJson = append(finalJson, ValidationJson{Status: status, Data: user})
	}
	content, err := json.Marshal(finalJson)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	// fmt.Println(string(content))
	return content
}

// Calling HandleRegistration function whenever there is a request to the URL
func validateForm(email, password, repassword, firstName, lastName, birth, avatar, username, about string) ([]byte, int) {
	var user []DataValidation
	user_error := ""
	email_error := ""
	password_error := ""
	firstName_error := ""
	lastName_error := ""
	registered_error := ""

	if DB.GetUserID(username) == -1 && ValidatePasswordUsername(username, false) &&
		ValidatePasswordUsername(password, true) && !DB.EmailExists(email) &&
		password == repassword && len(password) > 7 && len(password) < 21 &&
		ValidateMail(email) && len(firstName) >= 2 && len(firstName) < 14 &&
		ValidatePasswordUsername(firstName, false) &&
		len(lastName) >= 2 && len(lastName) < 14 && ValidatePasswordUsername(lastName, false) &&
		isValidDateOfBirth(birth) && validateAboutMe(about) == "" {
		passwordH, _ := HashPassword(password)

		//ADD USER TO DB
		if CheckPasswordHash(passwordH, repassword) && DB.CreateUser(username, passwordH, email, firstName, lastName, birth, about, avatar, 1) == "200 OK" {
			// APPENDING NEW USER TO JSON FILE
			user = append(user, DataValidation{})
			return addUsertoJson(user, 200), http.StatusOK
		}
	}

	if DB.GetUserID(username) != -1 {
		user_error = "Nickname already exists"
	}
	if username != "" && len(username) < 4 || len(username) > 14 || !ValidatePasswordUsername(username, false) {
		user_error = "Username must be 4 - 14 characters, and include no special characters"
	}
	if (len(firstName) <= 1) || (len(firstName) > 14) || !ValidatePasswordUsername(firstName, false) {
		firstName_error = "First name must be 2 - 14 characters, and include no special characters"
	}
	if (len(lastName) <= 1) || (len(lastName) > 14) || !ValidatePasswordUsername(lastName, false) {
		lastName_error = "Last name must be 2 - 14 characters, and include no special characters"
	}
	if !ValidateMail(email) {
		email_error = "Incorrectly given email"
	}
	if DB.GetEmail(email) == email {
		email_error = "Email already used"
	}
	if email == "" {
		email_error = "Email field can not be empty"
	}
	if password != repassword {
		password_error = "Passwords don't match"
	}
	if !ValidatePasswordUsername(password, true) || len(password) < 8 || len(password) > 20 {
		password_error = "Password invalid"
	}
	if len(user_error) > 0 {
		username = ""
	}
	if len(email_error) > 0 {
		email = ""
	}
	if user_error != "" {
		user = append(user, DataValidation{Field: "user", Message: user_error})
	}
	if email_error != "" {
		user = append(user, DataValidation{Field: "email", Message: email_error})
	}
	if password_error != "" {
		user = append(user, DataValidation{Field: "password", Message: password_error})
	}
	if firstName_error != "" {
		user = append(user, DataValidation{Field: "first name", Message: firstName_error})
	}
	if lastName_error != "" {
		user = append(user, DataValidation{Field: "last name", Message: lastName_error})
	}
	if !isValidDateOfBirth(birth) {
		birth_error := "You should be at least 5 years old"
		user = append(user, DataValidation{Field: "birth", Message: birth_error})
	}
	about_err := validateAboutMe(about)
	if about_err != "" {
		user = append(user, DataValidation{Field: "aboutMe", Message: about_err})
	}
	if DB.EmailExists(email) {
		registered_error = "User already registered"
		user = append(user, DataValidation{Field: "email", Message: registered_error})
	}

	// CHECK THIS
	return addUsertoJson(user, 400), http.StatusBadRequest
}

func ValidatePasswordUsername(pwd string, stat bool) bool {
	A := false
	a := false
	numb := false
	validate := true
	for _, symb := range pwd {
		if symb >= 'A' && symb <= 'Z' {
			A = true
		} else if symb >= 'a' && symb <= 'z' {
			a = true
		} else if symb >= '0' && symb <= '9' {
			numb = true
		} else if stat && SpecialCharacter(symb) {
			continue
		} else {
			validate = false
		}
	}
	if stat {
		if !A || !a || !numb {
			validate = false
		}
	} else if len(pwd) == 0 {
		validate = true
	}
	return validate
}

func SpecialCharacter(symb rune) bool {
	if symb == '!' || symb >= '#' && symb <= '&' || symb >= '(' && symb <= '+' {
		return true
	}
	return false
}

func ValidateMail(mail string) bool {
	if len(mail) == 0 {
		return false
	}
	if strings.Contains(mail[1:], "@") && len(mail) > 5 {
		for i, symb := range mail {
			if symb == '@' {
				if strings.Contains(mail[i+2:], ".") && mail[len(mail)-1] != '.' {
					return true
				}
			}
		}
	}
	return false
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(hash, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func isValidDateOfBirth(dateOfBirth string) bool {
	parsedDate, err := time.Parse("2006-01-02", dateOfBirth)
	if err != nil {
		return false
	}

	minAge := 5
	minBirthDate := time.Now().AddDate(-minAge, 0, 0)

	return !parsedDate.After(minBirthDate)
}

func validateAboutMe(aboutMe string) string {
	maxLength := 500

	// Validate that the input does not exceed the maximum length
	if len(aboutMe) > maxLength {
		return "About me field should not exceed " + strconv.Itoa(maxLength) + " characters"
	}

	// Determine what characters are allowed in the field
	reg := regexp.MustCompile(`^[a-zA-Z0-9,.!? ]*$`)

	// Validate that the input only contains these characters
	if !reg.MatchString(aboutMe) {
		return "About me field should only contain alphanumeric characters, commas, periods, exclamation marks, question marks, and spaces"
	}

	return ""
}

func SetRandomAvatar() string {
	//pick a random avatar from upload directory
	avatars := []string{"fox.jpeg", "racoon.jpeg", "monkey.jpeg", "polar_bear.jpeg", "red_panda.jpeg", "tiger.jpeg"}
	ImgUrl := "/upload/" + avatars[rand.Intn(len(avatars))]
	return ImgUrl
}
