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
			Endpoint:    "/user",
			GetFunction: handlers.GetUser,
		},
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
			Endpoint:     "/group_join",
			PostFunction: handlers.GroupJoin,
		},
		{
			Endpoint:     "/event",
			PostFunction: handlers.EventAdd,
		},
		{
			Endpoint:     "/event_join",
			PostFunction: handlers.EventJoin,
		},
		{
			Endpoint:    "/history",
			GetFunction: handlers.GetHistory,
		},
		{
			Endpoint:     "/perprofile",
			GetFunction:  handlers.PersonalProfile,
			PostFunction: handlers.TogglePrivacy,
		},
		{
			Endpoint:    "/allchats",
			GetFunction: handlers.GetAllChat,
		},
		{
			Endpoint:     "/loggedin",
			PostFunction: handlers.LoggedIn,
		},
		{
			Endpoint:     "/follow",
			GetFunction:  handlers.GetFollows,
			PostFunction: handlers.ToggleFollow,
		},
		{
			Endpoint:     "/pending",
			PostFunction: handlers.ResolvePending,
		},
		{
			Endpoint:    "/visible",
			GetFunction: handlers.GetVisiblePosts,
		},
		{
			Endpoint:     "/notification",
			GetFunction:  handlers.GetNotifications,
			PostFunction: handlers.ReplyNotifications,
		},
	}

	handlers.Start(collection)
}
