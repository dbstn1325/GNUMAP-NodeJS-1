CREATE TABLE building (
    building_num INT PRIMARY KEY,
    building_name VARCHAR(128) NOT NULL,
    building_lat TEXT NOT NULL,
    building_lag TEXT NOT NULL,
);

CREATE TABLE convenient (
    convenient_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    convenient_name VARCHAR(30) NOT NULL,
    convenient_image VARCHAR(255) NOT NULL,
    convenient_phone VARCHAR(15) NOT NULL,
    convenient_lat DECIMAL(25,20) NOT NULL,
    convenient_lng DECIMAL(25,20) NOT NULL,
    category VARCHAR(10) NOT NULL,
);

CREATE TABLE request (
    request_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    building_num INT NOT NULL,
    request_buliding_name VARCHAR(128) NOT NULL,
    request_building_location TEXT NOT NULL,
    request_revise TEXT NOT NULL,
    FOREIGN KEY(building_num) REFERENCES building(building_num)
);

-------------------
CREATE TABLE user (
    user_id INT PRIMARY KEY NOT NULL
);

CREATE TABLE likes (
    likes_id INT PRIMARY KEY NOT NULL,
    building_num INT NOT NULL,
    status CHAR(1) NOT NULL,
    FOREIGN KEY(building_num) REFERENCES building(building_num),
    FOREIGN KEY(user_id) REFERENCES user(user_id)
    FOREIGN KEY(convenient_id) REFERENCES convenient(convenient_id),
);

CREATE TABLE search_history (
    history_id INT PRIMARY KEY NOT NULL,
    history_contents VARCHAR(45) NOT NULL,
    isDeleted CHAR(1) NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(user_id)
);

INSERT INTO BUILDING VALUES (30, "컴퓨터과학관", "35.1545202201429", "128.098324310217")