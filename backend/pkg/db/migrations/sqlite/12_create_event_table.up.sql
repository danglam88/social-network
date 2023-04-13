CREATE TABLE IF NOT EXISTS event (
    id INTEGER NOT NULL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    title VARCHAR(30) NOT NULL,
    descript VARCHAR(100) NOT NULL,
    occur_time DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(creator_id) REFERENCES user(id),
    FOREIGN KEY(group_id) REFERENCES user_group(id)
);

INSERT INTO event (id,creator_id,group_id,title,descript,occur_time,created_at)
VALUES
    (1,7,2,"Invasion Training","Let's do some practice for the Earth invasion campaign!",DateTime('now','localtime'),DateTime('now','localtime')),
    (2,5,1,"Defense Training","Let's do some practice for protecting the Earth from Andromeda's invasion!",DateTime('now','localtime'),DateTime('now','localtime'));
