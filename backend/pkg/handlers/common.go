package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	db "socialnetwork/backend/pkg/db/sqlite"
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
	Status   string
	Token    string
	UserId   int
	Username string
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

	// jsFs := http.FileServer(http.Dir("./src"))
	// mux.Handle("/src/", http.StripPrefix("/src/", jsFs))

	reactapp := http.FileServer(http.Dir("../frontend/build"))
	mux.Handle("/", http.StripPrefix("/", reactapp))

	manager := NewManager()
	mux.HandleFunc("/ws", manager.serveWS)

	log.Fatal(http.ListenAndServe(":8080", mux))
}

func GetFunc(handler Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		enableCors(&w, r)

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

// for development mod only, should be deleted after
func enableCors(w *http.ResponseWriter, r *http.Request) {

	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	if r.Method == "OPTIONS" {
		(*w).WriteHeader(http.StatusOK)
		return
	}
}
