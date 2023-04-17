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
		/*{
			Endpoint:    "/users",
			GetFunction: handlers.GetUsers,
		},*/
		{
			Endpoint:    "/allusers",
			GetFunction: handlers.GetAllUsers,
		},
		{
			Endpoint:     "/group",
			GetFunction:  handlers.GroupGet,
			PostFunction: handlers.GroupAdd,
		},
		{
			Endpoint:    "/history",
			GetFunction: handlers.GetHistory,
		},
		{
			Endpoint:     "/perprofile",
			PostFunction: handlers.PersonalProfile,
		},
		{
			Endpoint:    "/allchats",
			GetFunction: handlers.GetAllChat,
		},
	}

	handlers.Start(collection)
}
