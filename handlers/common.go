package handlers

import (
	"encoding/json"
	"forum/db"
	"io"
	"log"
	"net/http"
)

const RESPONSE_OK = "ok"
const RESPONSE_ERR = "error"

type handlerFunction func(w http.ResponseWriter, r *http.Request)

type Handler struct {
	Endpoint     string
	Method       string
	GetFunction  handlerFunction
	PostFunction handlerFunction
}

type Response struct {
	Status string
	Data   string
}

type ResponseError struct {
	Status string
	Error  string
}

var DB db.Db

func Start(collection []Handler) {

	// Opening the database
	DB = db.OpenDatabase()
	defer DB.Close()

	mux := http.NewServeMux()

	for _, handler := range collection {
		mux.Handle(handler.Endpoint, GetFunc(handler))
	}

	jsFs := http.FileServer(http.Dir("./src"))
	mux.Handle("/src/", http.StripPrefix("/src/", jsFs))

	manager := NewManager()
	mux.HandleFunc("/ws", manager.serveWS)

	log.Fatal(http.ListenAndServe(":8080", mux))

}

func GetFunc(handler Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		if r.Method == "GET" && handler.GetFunction != nil {
			handler.GetFunction(w, r)
		} else if r.Method == "POST" && handler.PostFunction != nil {
			handler.PostFunction(w, r)
		} else {
			w.WriteHeader(http.StatusNotFound)
		}
	}
}

func GetErrResponse(w http.ResponseWriter, errorMess string, statusCode int) {
	w.WriteHeader(statusCode)
	response := ResponseError{Status: RESPONSE_ERR, Error: errorMess}
	res, _ := json.Marshal(response)
	io.WriteString(w, string(res))
}
