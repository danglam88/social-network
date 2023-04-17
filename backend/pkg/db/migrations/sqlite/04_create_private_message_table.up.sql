CREATE TABLE IF NOT EXISTS private_message (
    id INTEGER NOT NULL PRIMARY KEY,
    chat_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    sender_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(chat_id) REFERENCES private_chat(id),
    FOREIGN KEY(sender_id) REFERENCES user(id)
);

INSERT INTO private_message (id,chat_id,content,sender_id,created_at)
VALUES
    (1,1,"ola",1,DateTime('now','localtime')),
    (2,1,"chao",2,DateTime('now','localtime')),
    (3,2,"I'll find you",6,DateTime('now','localtime')),
    (4,2,"No, you won't",7,DateTime('now','localtime')),
    (5,3,"Let's all save the Earth!",1,DateTime('now','localtime')),
    (6,3,"We need a clear plan for this.",2,DateTime('now','localtime')),
    (7,3,"Should we have a meeting tomorrow?",3,DateTime('now','localtime')),
    (8,3,"Yes, let's kick-off at 1pm then.",4,DateTime('now','localtime')),
    (9,3,"We must hurry, the fate of the Earth is in our hands.",5,DateTime('now','localtime')),
    (10,4,"You should stop doing that, once and for all!",6,DateTime('now','localtime')),
    (11,4,"You better join my Earth invasion campaign, dude!",7,DateTime('now','localtime'));;
