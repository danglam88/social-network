CREATE TABLE IF NOT EXISTS event_relation (
    id INTEGER NOT NULL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_approved TINYINT(1) NOT NULL,
    is_going TINYINT(1),
    FOREIGN KEY(event_id) REFERENCES event(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
);
CREATE UNIQUE INDEX idx_event_user ON event_relation (event_id, user_id);
INSERT INTO event_relation (id, event_id, user_id, is_approved, is_going)
VALUES (1, 1, 7, 1, 1),
    (2, 1, 6, 1, 0),
    (3, 2, 5, 1, 1),
    (4, 2, 4, 1, 1),
    (5, 2, 3, 0, 0),
    (6, 2, 2, 1, 1),
    (7, 2, 1, 1, 0);