package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Person struct {
	Token string `json:"token"`
}

func PersonalProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		GetErrResponse(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Read the request body
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		GetErrResponse(w, "Cannot read request body", http.StatusBadRequest)
		return
	}

	// Parse the JSON data into a Go struct
	var person Person
	err = json.Unmarshal(body, &person)
	if err != nil {
		GetErrResponse(w, "Not a valid json object", http.StatusBadRequest)
		return
	}

	// Use the person data
	fmt.Println("Token: ", person.Token)

	// Send a response
	w.WriteHeader(http.StatusOK)
}
