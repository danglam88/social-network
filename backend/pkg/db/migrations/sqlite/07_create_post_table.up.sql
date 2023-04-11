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
