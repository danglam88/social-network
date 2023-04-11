CREATE TABLE user (
    id INTEGER NOT NULL PRIMARY KEY,
    email VARCHAR(30) NOT NULL,
    passwrd VARCHAR(100) NOT NULL,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    birthdate VARCHAR(30) NOT NULL,
    is_private TINYINT(1) NOT NULL,
    created_at DATETIME NOT NULL,
    avatar_url VARCHAR(100),
    nickname VARCHAR(30),
    about_me VARCHAR(100)
);

CREATE TABLE user_group (
    id INTEGER NOT NULL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    group_name VARCHAR(30) NOT NULL,
    descript VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(creator_id) REFERENCES user(id)
);

CREATE TABLE group_relation (
    id INTEGER NOT NULL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_requested TINYINT(1),
    is_approved TINYINT(1),
    FOREIGN KEY(group_id) REFERENCES user_group(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE follow_relation (
    id INTEGER NOT NULL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    followed_id INTEGER NOT NULL,
    is_approved TINYINT(1) NOT NULL,
    FOREIGN KEY(follower_id) REFERENCES user(id),
    FOREIGN KEY(followed_id) REFERENCES user(id)
);

CREATE TABLE post (
    id INTEGER NOT NULL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    group_id INTEGER,
    visibility TINYINT(2) NOT NULL,
    title VARCHAR(30) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    img_url VARCHAR(100),
    FOREIGN KEY(creator_id) REFERENCES user(id),
    FOREIGN KEY(group_id) REFERENCES user_group(id)
);

CREATE TABLE post_visibility (
    id INTEGER NOT NULL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    viewer_id INTEGER NOT NULL,
    FOREIGN KEY(post_id) REFERENCES post(id),
    FOREIGN KEY(viewer_id) REFERENCES user(id)
);

CREATE TABLE comment (
    id INTEGER NOT NULL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    img_url VARCHAR(100),
    FOREIGN KEY(creator_id) REFERENCES user(id),
    FOREIGN KEY(post_id) REFERENCES post(id)
);

CREATE TABLE private_chat (
    id INTEGER NOT NULL PRIMARY KEY,
    first_userid INTEGER NOT NULL,
    second_userid INTEGER NOT NULL,
    FOREIGN KEY(first_userid) REFERENCES user(id),
    FOREIGN KEY(second_userid) REFERENCES user(id)
);

CREATE TABLE private_message (
    id INTEGER NOT NULL PRIMARY KEY,
    private_chatid INTEGER NOT NULL,
    content TEXT NOT NULL,
    sender_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(private_chatid) REFERENCES private_chat(id),
    FOREIGN KEY(sender_id) REFERENCES user(id)
);

CREATE TABLE group_chat (
    id INTEGER NOT NULL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    FOREIGN KEY(group_id) REFERENCES user_group(id)
);

CREATE TABLE group_message (
    id INTEGER NOT NULL PRIMARY KEY,
    group_chatid INTEGER NOT NULL,
    content TEXT NOT NULL,
    sender_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(group_chatid) REFERENCES group_chat(id),
    FOREIGN KEY(sender_id) REFERENCES user(id)
);

CREATE TABLE event (
    id INTEGER NOT NULL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    title VARCHAR(30) NOT NULL,
    descript VARCHAR(100) NOT NULL,
    occur_time DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(creator_id) REFERENCES user(id),
    FOREIGN KEY(group_id) REFERENCES user_group(id)
);

CREATE TABLE event_relation (
    id INTEGER NOT NULL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_approved TINYINT(1) NOT NULL,
    is_going TINYINT(2),
    FOREIGN KEY(event_id) REFERENCES event(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
);
