CREATE TABLE comment (
    id INTEGER NOT NULL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    img_url VARCHAR(100),
    FOREIGN KEY(creator_id) REFERENCES user(id),
    FOREIGN KEY(post_id) REFERENCES post(id)
);
