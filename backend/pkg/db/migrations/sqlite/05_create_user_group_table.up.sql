CREATE TABLE user_group (
    id INTEGER NOT NULL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    group_name VARCHAR(30) NOT NULL,
    descript VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(creator_id) REFERENCES user(id)
);
