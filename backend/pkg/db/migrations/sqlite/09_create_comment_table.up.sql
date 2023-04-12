CREATE TABLE comment (
    id INTEGER NOT NULL PRIMARY KEY,
    creator_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    img_url VARCHAR(100),
    FOREIGN KEY(creator_id) REFERENCES user(id),
    FOREIGN KEY(post_id) REFERENCES post(id)
);

INSERT INTO comment (id,creator_id,post_id,content,created_at,img_url)
VALUES
    (1,7,4,"I'm the owner of this game :))",DateTime('now','localtime'),""),
    (2,6,5,"Is this where Joker's hiding?",DateTime('now','localtime'),""),
    (3,5,2,"Swedish is a difficult language :)",DateTime('now','localtime'),""),
    (4,4,1,"Fried banana ice-cream is weird :(",DateTime('now','localtime'),""),
    (5,3,3,"I'll definitely try one day",DateTime('now','localtime'),""),
    (6,2,1,"They eat fried banana in Asia",DateTime('now','localtime'),""),
    (7,1,2,"German is difficult, too :)",DateTime('now','localtime'),"");
