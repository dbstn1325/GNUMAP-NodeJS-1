CREATE TABLE building (
    num INT,
    name VARCHAR(128) NOT NULL,
    lat DECIMAL(25,20) NOT NULL,
    lng DECIMAL(25,20) NOT NULL,
);

CREATE TABLE convenient (
    name VARCHAR(30) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    lat DECIMAL(25,20) NOT NULL,
    lng DECIMAL(25,20) NOT NULL,
    open VARCHAR(15) NOT NULL,
    close VARCHAR(15) NOT NULL,
    category VARCHAR(10) NOT NULL,
);

CREATE TABLE revise (
    title VARCHAR(100) NOT NULL,
    body VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-------------------


INSERT INTO building VALUES (30, "컴퓨터과학관", "35.1545202201429", "128.098324310217")

INSERT INTO convenient VALUES("CU 경상대 공학관점", "055-753-7830", "35.1583645623225", "128.09978350749392", "09:00", "24:00", "편의점")
INSERT INTO convenient VALUES("CU 경상대 느티마루점", "055-772-0955", "35.15067463020352", "128.09799553889857", "09:00", "18:30", "편의점")