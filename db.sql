CREATE TABLE signup (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone_number VARCHAR(15),
  district VARCHAR(100),
  state VARCHAR(100),
  dob DATE,
  blood_group VARCHAR(5),
  donate_blood BOOLEAN DEFAULT FALSE,
  password TEXT
);

CREATE TABLE login (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  password TEXT
);

create table vehicles (id serial primary key,owner_name varchar(20) not null,vehicle_type varchar(20) not null,vehicle_model varchar(50) not null, phone_number varchar(10) not null,email varchar(30) not null,district varchar(20) not null);