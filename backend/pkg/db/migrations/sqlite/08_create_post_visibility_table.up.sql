CREATE TABLE post_visibility (
    id INTEGER NOT NULL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    viewer_id INTEGER NOT NULL,
    FOREIGN KEY(post_id) REFERENCES post(id),
    FOREIGN KEY(viewer_id) REFERENCES user(id)
);

INSERT INTO post_visibility (id,post_id,viewer_id)
VALUES
    (1,7,6),
    (2,7,1),
    (3,7,2),
    (4,7,3),
    (5,7,4),
    (6,7,5);
