-- CREATE TYPE user_role AS enum (
--     'admin', 
--     'user'
-- );

create table users (
    user_id VARCHAR(100) PRIMARY KEY,
	username VARCHAR (50) UNIQUE NOT NULL,
    email VARCHAR (355) UNIQUE NOT NULL,
	password VARCHAR (500) NOT NULL,
    first_name VARCHAR(55),
    last_name VARCHAR(55),
    user_role VARCHAR(55)
    -- phone_number VARCHAR(15),
);

CREATE TABLE metadata (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES users(user_id),
    created_on TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);

CREATE TABLE tags(
    id VARCHAR(100) PRIMARY KEY,
    tag_id VARCHAR(100) UNIQUE NOT NULL,
    text VARCHAR(300),
    user_id VARCHAR NOT NULL REFERENCES users(user_id)
)


-- this for seeding user but i need to hash the password
-- INSERT INTO users (user_id, username, email, password, )
-- VALUES (1, 'John', 'Doe');