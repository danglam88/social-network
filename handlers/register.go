package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"

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

	err := r.ParseForm()
	if err != nil {
		errorMess := "Error parsing the form"
		GetErrResponse(w, errorMess, http.StatusBadRequest)
		return
	}

	username := r.FormValue("username")
	email := r.FormValue("email")
	password := r.FormValue("password")
	repassword := r.FormValue("repassword")
	firstName := r.FormValue("firstName")
	lastName := r.FormValue("lastName")
	age := r.FormValue("age")
	gender := r.FormValue("gender")

	json, status := validateForm(username, email, password, repassword, firstName, lastName, age, gender)
	// fmt.Println(string(json))
	w.WriteHeader(status)
	io.WriteString(w, string(json))
}

func RegisterGet(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "index.html")
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
func validateForm(username, email, password, repassword, firstName, lastName, age, gender string) ([]byte, int) {
	var user []DataValidation
	user_error := ""
	email_error := ""
	password_error := ""
	firstName_error := ""
	lastName_error := ""
	age_error := ""

	if DB.GetUserID(username) == -1 && ValidatePasswordUsername(username, false) &&

		ValidatePasswordUsername(password, true) &&
		len(username) > 3 && len(username) < 15 &&
		DB.GetEmail(email) != email &&
		password == repassword && len(password) > 7 && len(password) < 21 &&
		ValidateMail(email) && len(firstName) > 2 && len(firstName) < 14 &&
		ValidatePasswordUsername(firstName, false) &&
		len(lastName) > 2 && len(lastName) < 14 && ValidatePasswordUsername(lastName, false) && validateAge(age) {
		passwordH, _ := HashPassword(password)
		//ADD USER TO DB
		if CheckPasswordHash(passwordH, repassword) && DB.CreateUser(username, passwordH, email, firstName, lastName, gender, age, 1) == "200 OK" {
			// APPENDING NEW USER TO JSON FILE
			user = append(user, DataValidation{})
			return addUsertoJson(user, 200), http.StatusOK
		}
	}

	if DB.GetUserID(username) != -1 {
		user_error = "User already exists"
	}
	if len(username) < 4 || len(username) > 14 || !ValidatePasswordUsername(username, false) {
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
	if len(age) > 3 {
		age_error = "You need to have less than 999 years"
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
	if age_error != "" {
		user = append(user, DataValidation{Field: "age", Message: age_error})
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

func validateAge(age string) bool {
	match, _ := regexp.MatchString("^\\d{0,3}\\b", age)
	return match
}
