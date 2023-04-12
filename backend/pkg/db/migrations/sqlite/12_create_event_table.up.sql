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
