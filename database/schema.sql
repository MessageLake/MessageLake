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

CREATE TABLE messages (
  id int(11) NOT NULL AUTO_INCREMENT,
  content text NOT NULL,
  author int NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (author) REFERENCES authors (id)
);

CREATE TABLE tags (
  id int(11) NOT NULL AUTO_INCREMENT,
  tag text NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE tags_on_messages (
  id int(11) NOT NULL AUTO_INCREMENT,
  tag int NOT NULL,
  user_message int NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FOREIGN KEY (tag) REFERENCES tags (id),
  CONSTRAINT FOREIGN KEY (user_message) REFERENCES messages (id)
);
