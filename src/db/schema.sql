CREATE TABLE building (
    building_num INT PRIMARY KEY,
    building_name VARCHAR(128) NOT NULL,
    building_image TEXT NOT NULL,
    building_info TEXT NOT NULL,
    building_lat TEXT NOT NULL,
    building_lag TEXT NOT NULL
);

CREATE TABLE request (
    `key` INT PRIMARY KEY NOT NULL,
    building_num INT NOT NULL,
    request_buliding_name VARCHAR(128) NOT NULL,
    request_building_location TEXT NOT NULL,
    request_revise TEXT NOT NULL,
    FOREIGN KEY(building_num) REFERENCES building(building_num)
);

CREATE TABLE user (
    `key` INT PRIMARY KEY NOT NULL
);

CREATE TABLE `like` (
    `key` INT PRIMARY KEY NOT NULL,
    building_num INT NOT NULL,
    status CHAR(1) NOT NULL,
    FOREIGN KEY(building_num) REFERENCES building(building_num),
    FOREIGN KEY(`key`) REFERENCES user(`key`)
    FOREIGN KEY(`key`) REFERENCES convenient(convenient_id),
);

CREATE TABLE search_history (
    history_id INT PRIMARY KEY NOT NULL,
    `KEY` INT NOT NULL,
    history_contents VARCHAR(45) NOT NULL,
    isDeleted CHAR(1) NOT NULL,
);

CREATE TABLE convenient (
    convenient_id INT PRIMARY KEY NOT NULL,
    convenient_name VARCHAR(64) NOT NULL,
    convenient_image TEXT NOT NULL,
    convenient_phone TEXT NOT NULL,
    convenient_lat TEXT NOT NULL,
    convenient_lng TEXT NOT NULL,
    category VARCHAR(32) NOT NULL,
);

-------------------
