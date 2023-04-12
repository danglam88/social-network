CREATE TABLE group_relation (
    id INTEGER NOT NULL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    is_requested TINYINT(1),
    is_approved TINYINT(1),
    FOREIGN KEY(group_id) REFERENCES user_group(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
);

INSERT INTO group_relation (id,group_id,user_id,is_requested,is_approved)
VALUES
    (1,1,5,0,1),
    (2,1,4,0,1),
    (3,1,3,0,1),
    (4,1,2,1,1),
    (5,1,1,0,1),
    (6,2,6,0,1),
    (7,2,7,1,1);
