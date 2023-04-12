CREATE TABLE group_message (
    id INTEGER NOT NULL PRIMARY KEY,
    group_chatid INTEGER NOT NULL,
    content TEXT NOT NULL,
    sender_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(group_chatid) REFERENCES group_chat(id),
    FOREIGN KEY(sender_id) REFERENCES user(id)
);
