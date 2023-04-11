CREATE TABLE user (
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
    (1,"danilo.cangucu@gritlab.ax","$2a$14$DEdZfmpt910DZh41/H8ApeTecGFZ55v1p.DETh2/DXJ9D0ksqVkhu","danilo","cangucu",DateTime('now','localtime'),1,DateTime('now','localtime')),
    (2,"dang.lam@gritlab.ax","$2a$14$GTXlBMDLMJq0UXCIq40FF.UOxqDP7aMVl/dh5SRdbSBl5Ss2aYWUe","dang","lam",DateTime('now','localtime'),1,DateTime('now','localtime')),
    (3,"iuliia.chipsanova@gritlab.ax","$2a$14$x/p9Ds7EUYxhX3jRaTOCKue9PByvhBatwsEIZx/3laO19vQcpiRdK","iuliia","chipsanova",DateTime('now','localtime'),1,DateTime('now','localtime')),
    (4,"malin.oscarius@gritlab.ax","$2a$14$2DzMB74I10pRtzy3/5BHd.OXsj3S5iXYiq7ufALEMgm.NcCPzaZwK","malin","oscarius",DateTime('now','localtime'),1,DateTime('now','localtime')),
    (5,"karl.johannes@gritlab.ax","$2a$14$H6N.vY2uwdlhOwoORIMRaeldECn7BAbDcU/fiWZv5.0m0EuSLqoi2","karl","johannes",DateTime('now','localtime'),1,DateTime('now','localtime')),
    (6,"super@power.rich","$2a$14$L4tSoMJVVvc90z0hy4SeQ.fa19scUeDAcy/kYosgOd5PFrXUehDsi","bruce","wayne",DateTime('now','localtime'),0,DateTime('now','localtime')),
    (7,"wanna@kill.batman","$2a$14$2b./lLQiX4La37U2RghRcucvy/Bme0nQvp5my9bYN0ME41mJhXt5G","jack","white",DateTime('now','localtime'),0,DateTime('now','localtime'));
