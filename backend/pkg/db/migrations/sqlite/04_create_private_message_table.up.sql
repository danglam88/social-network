CREATE TABLE private_message (
    id INTEGER NOT NULL PRIMARY KEY,
    private_chatid INTEGER NOT NULL,
    content TEXT NOT NULL,
    sender_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(private_chatid) REFERENCES private_chat(id),
    FOREIGN KEY(sender_id) REFERENCES user(id)
);
