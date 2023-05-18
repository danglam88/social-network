CREATE TABLE IF NOT EXISTS post (
    id INTEGER NOT NULL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    group_id INTEGER,
    visibility TINYINT(2) NOT NULL,
    title VARCHAR(30) NOT NULL,
    content TEXT,
    created_at DATETIME NOT NULL,
    img_url VARCHAR(100),
    FOREIGN KEY(creator_id) REFERENCES user(id),
    FOREIGN KEY(group_id) REFERENCES user_group(id)
);

INSERT INTO post (id,creator_id,group_id,visibility,title,content,created_at,img_url)
VALUES
    (1,2,0,0,"Asian Food","Thai Khun Mom serves very typical Asian food in Mariehamn",DateTime('now','localtime'),""),
    (2,3,1,0,"Swedish Class","Swedish class occurs every Tuesday and Thursday from 4pm",DateTime('now','localtime'),""),
    (3,4,0,1,"Best Sushi","Fina Fisken is the best sushi in Mariehamn",DateTime('now','localtime'),""),
    (4,5,0,0,"Poker Night","Poker Game Night occurs every Friday from 8pm",DateTime('now','localtime'),""),
    (5,1,0,0,"Real Embassy","Brazilian Real Embassy is now in Mariehamn",DateTime('now','localtime'),""),
    (6,7,2,0,"Earth Invasion","Let's invade the Earth tomorrow!",DateTime('now','localtime'),""),
    (7,6,0,2,"Attention, the Earth!","Joker's gonna invade the Earth tommorrow. Be prepared!",DateTime('now','localtime'),"");
