CREATE TABLE IF NOT EXISTS group_chat (
    id INTEGER NOT NULL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    FOREIGN KEY(group_id) REFERENCES user_group(id)
);

INSERT INTO group_chat (id,group_id)
VALUES
    (1,1),
    (2,2);
