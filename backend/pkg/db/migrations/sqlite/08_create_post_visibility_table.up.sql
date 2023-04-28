CREATE TABLE IF NOT EXISTS post_visibility (
    id INTEGER NOT NULL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    viewer_id INTEGER NOT NULL,
    FOREIGN KEY(post_id) REFERENCES post(id),
    FOREIGN KEY(viewer_id) REFERENCES user(id)
);

INSERT INTO post_visibility (id,post_id,viewer_id)
VALUES
    (1,7,5);
