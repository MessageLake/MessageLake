CREATE DATABASE IF NOT EXISTS messagelake;

USE messagelake;
DROP TABLE IF EXISTS tags_on_messages;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id int(11) NOT NULL AUTO_INCREMENT,
  author text NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO authors (author) VALUES ('Jerry');
INSERT INTO authors (author) VALUES ('Elaine');
INSERT INTO authors (author) VALUES ('Kramer');
INSERT INTO authors (author) VALUES ('George');

CREATE TABLE messages (
  id int(11) NOT NULL AUTO_INCREMENT,
  content text NOT NULL,
  author int NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (author) REFERENCES authors (id)
);

INSERT INTO messages (content, author) VALUES ("What's the deal with airplane food?", 1);
INSERT INTO messages (content, author) VALUES ("Yada, yada, yada...", 2);
INSERT INTO messages (content, author) VALUES ("Wide lanes, Jerry!", 3);
INSERT INTO messages (content, author) VALUES ("I'm doin' the opposite!", 4);

CREATE TABLE tags (
  id int(11) NOT NULL AUTO_INCREMENT,
  tag text NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO tags (tag) VALUES ('joke');
INSERT INTO tags (tag) VALUES ('planes');
INSERT INTO tags (tag) VALUES ('gibberish');
INSERT INTO tags (tag) VALUES ('silly');
INSERT INTO tags (tag) VALUES ('highway');
INSERT INTO tags (tag) VALUES ('cars');
INSERT INTO tags (tag) VALUES ('plans');
INSERT INTO tags (tag) VALUES ('schemes');

CREATE TABLE tags_on_messages (
  id int(11) NOT NULL AUTO_INCREMENT,
  tag int NOT NULL,
  user_message int NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (tag) REFERENCES tags (id),
  CONSTRAINT FOREIGN KEY (user_message) REFERENCES messages (id)
);

INSERT INTO tags_on_messages (tag, user_message) VALUES (1, 1);
INSERT INTO tags_on_messages (tag, user_message) VALUES (2, 1);
INSERT INTO tags_on_messages (tag, user_message) VALUES (3, 2);
INSERT INTO tags_on_messages (tag, user_message) VALUES (4, 2);
INSERT INTO tags_on_messages (tag, user_message) VALUES (4, 3);
INSERT INTO tags_on_messages (tag, user_message) VALUES (5, 3);
INSERT INTO tags_on_messages (tag, user_message) VALUES (6, 3);
INSERT INTO tags_on_messages (tag, user_message) VALUES (7, 3);
INSERT INTO tags_on_messages (tag, user_message) VALUES (4, 4);
INSERT INTO tags_on_messages (tag, user_message) VALUES (6, 4);
INSERT INTO tags_on_messages (tag, user_message) VALUES (7, 4);
