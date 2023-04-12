CREATE TABLE follow_relation (
    id INTEGER NOT NULL PRIMARY KEY,
    follower_id INTEGER NOT NULL,
    followed_id INTEGER NOT NULL,
    is_approved TINYINT(1) NOT NULL,
    FOREIGN KEY(follower_id) REFERENCES user(id),
    FOREIGN KEY(followed_id) REFERENCES user(id)
);

INSERT INTO follow_relation (id,follower_id,followed_id,is_approved)
VALUES
    (1,1,2,1),
    (2,2,3,1),
    (3,3,4,1),
    (4,4,5,1),
    (5,5,6,0),
    (6,6,7,0),
    (7,7,1,0);
