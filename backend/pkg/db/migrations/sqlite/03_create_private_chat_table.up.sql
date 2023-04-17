CREATE TABLE IF NOT EXISTS private_chat (
    id INTEGER NOT NULL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    first_userid INTEGER NOT NULL,
    second_userid INTEGER NOT NULL,
    FOREIGN KEY(group_id) REFERENCES user_group(id),
    FOREIGN KEY(first_userid) REFERENCES user(id),
    FOREIGN KEY(second_userid) REFERENCES user(id)
);

INSERT INTO private_chat (id,group_id,first_userid,second_userid)
VALUES
    (1,0,1,2),
    (2,0,6,7),
    (3,1,0,0),
    (4,2,0,0)
