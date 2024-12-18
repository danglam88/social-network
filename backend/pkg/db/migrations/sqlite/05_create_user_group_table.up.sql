CREATE TABLE IF NOT EXISTS user_group (
    id INTEGER NOT NULL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    group_name VARCHAR(30) NOT NULL,
    descript VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    avatar_url VARCHAR(100),
    FOREIGN KEY(creator_id) REFERENCES user(id)
);

INSERT INTO user_group (id,creator_id,group_name,descript,created_at,avatar_url)
VALUES
    (1,5,"The Earth","Planet of the Solar System",DateTime('now','localtime'),"/upload/group.png"),
    (2,6,"Andromeda","Neighbor of the Milky Way",DateTime('now','localtime'),"/upload/group.png");
