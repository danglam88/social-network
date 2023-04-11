CREATE TABLE user (
 id INTEGER NOT NULL PRIMARY KEY,
 privilege INTEGER NOT NULL,
 username VARCHAR(30) NOT NULL,
 age INTEGER NOT NULL,
 gender VARCHAR(30) NOT NULL,
 first_name VARCHAR(30) NOT NULL,
 last_name VARCHAR(30) NOT NULL,
 passwrd VARCHAR(100) NOT NULL,
 email VARCHAR(30) NOT NULL,
 created_at DATETIME NOT NULL
);

CREATE TABLE category (
 id INTEGER NOT NULL PRIMARY KEY,
 category_name VARCHAR(30) NOT NULL,
 descript VARCHAR(100),
 created_at DATETIME NOT NULL
);

CREATE TABLE post (
 id INTEGER NOT NULL PRIMARY KEY,
 user_id INTEGER NOT NULL,
 title VARCHAR(30) NOT NULL,
 content TEXT NOT NULL,
 created_at DATETIME NOT NULL,
 dummy TINYINT(1) NOT NULL,
 FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE comment (
 id INTEGER NOT NULL PRIMARY KEY,
 user_id INTEGER NOT NULL,
 post_id INTEGER NOT NULL,
 content TEXT NOT NULL,
 created_at DATETIME NOT NULL,
 FOREIGN KEY(user_id) REFERENCES user(id),
 FOREIGN KEY(post_id) REFERENCES post(id)
);

CREATE TABLE category_relation (
 id INTEGER NOT NULL PRIMARY KEY,
 category_id INTEGER NOT NULL,
 post_id INTEGER NOT NULL,
 FOREIGN KEY(category_id) REFERENCES category(id),
 FOREIGN KEY(post_id) REFERENCES post(id)
);

CREATE TABLE chat (
     id INTEGER NOT NULL PRIMARY KEY,
     user_1 INTEGER NOT NULL,
     user_2 INTEGER NOT NULL,
     created_at DATETIME NOT NULL,
     FOREIGN KEY(user_1) REFERENCES user(id)
     FOREIGN KEY(user_2) REFERENCES user(id)
);

CREATE TABLE message (
    id INTEGER NOT NULL PRIMARY KEY,
    user INTEGER NOT NULL,
    chat_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(chat_id) REFERENCES chat(id)
);

INSERT INTO category (id,category_name,descript,created_at)
VALUES
    (1,"Cuisines","Recommendation regarding food in Mariehamn",DateTime('now','localtime')),
    (2,"Places","Places worth a visit in Mariehamn",DateTime('now','localtime')),
    (3,"Activities","Interesting events happening in Mariehamn",DateTime('now','localtime'));

INSERT INTO post (id,user_id,title,content,created_at, dummy)
VALUES
    (1,1,"Welcome to the Cuisines category!","Be the first to post in this category!",DateTime('now','localtime'), 1),
    (2,2,"Welcome to the Places category!","Be the first to post in this category!",DateTime('now','localtime'), 1),
    (3,3,"Welcome to the Activities category!","Be the first to post in this category!",DateTime('now','localtime'), 1),
    (4,2,"Asian Food","Thai Khun Mom serves very typical Asian food in Mariehamn",DateTime('now','localtime'), 1),
    (5,3,"Swedish Class","Swedish class occurs every Tuesday and Thursday from 4pm",DateTime('now','localtime'), 1),
    (6,4,"Best Sushi","Fina Fisken is the best sushi in Mariehamn",DateTime('now','localtime'), 1),
    (7,5,"Poker Night","Poker Game Night occurs every Friday from 8pm",DateTime('now','localtime'), 1),
    (8,1,"Real Embassy","Brazilian Real Embassy is now in Mariehamn",DateTime('now','localtime'), 1);

INSERT INTO category_relation (id,category_id,post_id)
VALUES
    (1,1,1),
    (2,2,2),
    (3,3,3),
    (4,1,4),
    (5,1,6),
    (6,2,4),
    (7,2,6),
    (8,2,8),
    (9,3,5),
    (10,3,7);
