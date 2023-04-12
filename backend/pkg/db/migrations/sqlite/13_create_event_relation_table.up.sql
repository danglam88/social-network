CREATE TABLE event_relation (
    id INTEGER NOT NULL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_approved TINYINT(1) NOT NULL,
    is_going TINYINT(2),
    FOREIGN KEY(event_id) REFERENCES event(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
);
