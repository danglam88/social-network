CREATE TABLE group_chat (
    id INTEGER NOT NULL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    FOREIGN KEY(group_id) REFERENCES user_group(id)
);
