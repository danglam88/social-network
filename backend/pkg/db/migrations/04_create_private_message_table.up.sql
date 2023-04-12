CREATE TABLE private_message (
    id INTEGER NOT NULL PRIMARY KEY,
    private_chatid INTEGER NOT NULL,
    content TEXT NOT NULL,
    sender_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(private_chatid) REFERENCES private_chat(id),
    FOREIGN KEY(sender_id) REFERENCES user(id)
);

INSERT INTO private_message (id,private_chatid,content,sender_id,created_at)
VALUES
    (1,1,"ola",1,DateTime('now','localtime')),
    (2,1,"chao",2,DateTime('now','localtime')),
    (3,2,"I'll find you",6,DateTime('now','localtime')),
    (4,2,"No, you won't",7,DateTime('now','localtime'));
