CREATE TABLE private_chat (
    id INTEGER NOT NULL PRIMARY KEY,
    first_userid INTEGER NOT NULL,
    second_userid INTEGER NOT NULL,
    FOREIGN KEY(first_userid) REFERENCES user(id),
    FOREIGN KEY(second_userid) REFERENCES user(id)
);

INSERT INTO private_chat (id,first_userid,second_userid)
VALUES
    (1,1,2),
    (2,6,7);
