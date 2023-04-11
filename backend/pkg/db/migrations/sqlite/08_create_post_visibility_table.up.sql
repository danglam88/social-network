CREATE TABLE post_visibility (
    id INTEGER NOT NULL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    viewer_id INTEGER NOT NULL,
    FOREIGN KEY(post_id) REFERENCES post(id),
    FOREIGN KEY(viewer_id) REFERENCES user(id)
);
