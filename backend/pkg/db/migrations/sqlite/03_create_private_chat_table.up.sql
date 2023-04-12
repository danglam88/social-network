CREATE TABLE private_chat (
    id INTEGER NOT NULL PRIMARY KEY,
    first_userid INTEGER NOT NULL,
    second_userid INTEGER NOT NULL,
    FOREIGN KEY(first_userid) REFERENCES user(id),
    FOREIGN KEY(second_userid) REFERENCES user(id)
);
