#!/bin/bash -e

sqlite3 socialnetwork.db < 01_create_user_table.up.sql
sqlite3 socialnetwork.db < 02_create_follow_relation_table.up.sql
sqlite3 socialnetwork.db < 03_create_private_chat_table.up.sql
sqlite3 socialnetwork.db < 04_create_private_message_table.up.sql
sqlite3 socialnetwork.db < 05_create_user_group_table.up.sql
sqlite3 socialnetwork.db < 06_create_group_relation_table.up.sql
sqlite3 socialnetwork.db < 07_create_post_table.up.sql
sqlite3 socialnetwork.db < 08_create_post_visibility_table.up.sql
sqlite3 socialnetwork.db < 09_create_comment_table.up.sql
sqlite3 socialnetwork.db < 10_create_group_chat_table.up.sql
sqlite3 socialnetwork.db < 11_create_group_message_table.up.sql
sqlite3 socialnetwork.db < 12_create_event_table.up.sql
sqlite3 socialnetwork.db < 13_create_event_relation_table.up.sql
