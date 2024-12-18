CREATE TABLE IF NOT EXISTS user (
    id INTEGER NOT NULL PRIMARY KEY,
    email VARCHAR(30) NOT NULL,
    passwrd VARCHAR(100) NOT NULL,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    birthdate VARCHAR(30) NOT NULL,
    is_private TINYINT(1) NOT NULL,
    created_at DATETIME NOT NULL,
    avatar_url VARCHAR(100),
    nickname VARCHAR(30),
    about_me VARCHAR(100)
);

INSERT INTO user (id,email,passwrd,firstname,lastname,birthdate,is_private,created_at,avatar_url,nickname,about_me)
VALUES
    (1,"danilo.cangucu@gritlab.ax","$2a$14$DEdZfmpt910DZh41/H8ApeTecGFZ55v1p.DETh2/DXJ9D0ksqVkhu","danilo","cangucu","1990-01-01",1,DateTime('now','localtime'),"/upload/tiger.jpeg","danilo",""),
    (2,"dang.lam@gritlab.ax","$2a$14$GTXlBMDLMJq0UXCIq40FF.UOxqDP7aMVl/dh5SRdbSBl5Ss2aYWUe","dang","lam","1988-01-01",1,DateTime('now','localtime'),"/upload/saiyan.png","dang",""),
    (3,"iuliia.chipsanova@gritlab.ax","$2a$14$x/p9Ds7EUYxhX3jRaTOCKue9PByvhBatwsEIZx/3laO19vQcpiRdK","iuliia","chipsanova","1992-01-01",1,DateTime('now','localtime'),"/upload/red_panda.jpeg","iuliia",""),
    (4,"malin.oscarius@gritlab.ax","$2a$14$2DzMB74I10pRtzy3/5BHd.OXsj3S5iXYiq7ufALEMgm.NcCPzaZwK","malin","oscarius","1983-01-01",1,DateTime('now','localtime'),"/upload/racoon.jpeg","malin",""),
    (5,"johannes.eckerman@gritlab.ax","$2a$14$H6N.vY2uwdlhOwoORIMRaeldECn7BAbDcU/fiWZv5.0m0EuSLqoi2","johannes","eckerman","1989-01-01",1,DateTime('now','localtime'),"/upload/polar_bear.jpeg","joman",""),
    (6,"super@power.rich","$2a$14$L4tSoMJVVvc90z0hy4SeQ.fa19scUeDAcy/kYosgOd5PFrXUehDsi","bruce","wayne","1919-01-01",0,DateTime('now','localtime'),"/upload/batman.jpeg","batman",""),
    (7,"wanna@kill.batman","$2a$14$2b./lLQiX4La37U2RghRcucvy/Bme0nQvp5my9bYN0ME41mJhXt5G","jack","white","1920-01-01",0,DateTime('now','localtime'),"/upload/joker.png","joker",""),
    (8,"nonickname@private.com","$2a$14$2b./lLQiX4La37U2RghRcucvy/Bme0nQvp5my9bYN0ME41mJhXt5G","nonickname","private","2000-01-01",1,DateTime('now','localtime'),"/upload/animation.gif","","");
