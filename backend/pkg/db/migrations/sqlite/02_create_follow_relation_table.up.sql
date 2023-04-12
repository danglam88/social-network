CREATE TABLE follow_relation (
    id INTEGER NOT NULL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    followed_id INTEGER NOT NULL,
    is_approved TINYINT(1) NOT NULL,
    FOREIGN KEY(follower_id) REFERENCES user(id),
    FOREIGN KEY(followed_id) REFERENCES user(id)
);
