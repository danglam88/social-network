package main

import (
	"socialnetwork/backend/pkg/handlers"
)

func main() {

	collection := []handlers.Handler{
		{
			Endpoint:     "/register",
			PostFunction: handlers.RegisterPost,
		},
		{
			Endpoint:     "/login",
			PostFunction: handlers.Login,
			GetFunction:  handlers.IsLogin,
		},
		{
			Endpoint:     "/logout",
			PostFunction: handlers.Logout,
		},
		{
			Endpoint:     "/post",
			GetFunction:  handlers.PostGet,
			PostFunction: handlers.PostAdd,
		},
		{
			Endpoint:     "/comment",
			PostFunction: handlers.CommentAdd,
			GetFunction:  handlers.CommentGet,
		},
		{
			Endpoint:    "/users",
			GetFunction: handlers.GetUsers,
		},
		{
			Endpoint:    "/allusers",
			GetFunction: handlers.GetAllUsers,
		},
		{
			Endpoint:    "/history",
			GetFunction: handlers.GetHistory,
		},
	}

	handlers.Start(collection)
}
