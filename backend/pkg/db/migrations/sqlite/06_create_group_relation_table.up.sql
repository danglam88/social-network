CREATE TABLE group_relation (
    id INTEGER NOT NULL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_requested TINYINT(1),
    is_approved TINYINT(1),
    FOREIGN KEY(group_id) REFERENCES user_group(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
);
