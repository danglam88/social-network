CREATE TABLE group_message (
    id INTEGER NOT NULL PRIMARY KEY,
    group_chatid INTEGER NOT NULL,
    content TEXT NOT NULL,
    sender_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY(group_chatid) REFERENCES group_chat(id),
    FOREIGN KEY(sender_id) REFERENCES user(id)
);

INSERT INTO group_message (id,group_chatid,content,sender_id,created_at)
VALUES
    (1,1,"Let's all save the Earth!",1,DateTime('now','localtime')),
    (2,1,"We need a clear plan for this.",2,DateTime('now','localtime')),
    (3,1,"Should we have a meeting tomorrow?",3,DateTime('now','localtime')),
    (4,1,"Yes, let's kick-off at 1pm then.",4,DateTime('now','localtime')),
    (5,1,"We must be hurry, the fate of the Earth is in our hands.",5,DateTime('now','localtime')),
    (6,2,"You should stop doing that, once and for all!",6,DateTime('now','localtime')),
    (7,2,"You're better join my Earth invasion campaign, dude!",7,DateTime('now','localtime'));
