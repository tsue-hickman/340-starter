-- Create tables for CSE Motors
CREATE TYPE account_type AS ENUM ('Client', 'Employee', 'Admin');

CREATE TABLE
    IF NOT EXISTS classification (
        classification_id SERIAL PRIMARY KEY,
        classification_name VARCHAR(30) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS inventory (
        inv_id SERIAL PRIMARY KEY,
        inv_make VARCHAR(30) NOT NULL,
        inv_model VARCHAR(30) NOT NULL,
        inv_year INTEGER NOT NULL,
        inv_description TEXT NOT NULL,
        inv_image VARCHAR(50) NOT NULL,
        inv_thumbnail VARCHAR(50) NOT NULL,
        inv_price DECIMAL(10, 2) NOT NULL,
        inv_miles INTEGER NOT NULL,
        inv_color VARCHAR(20) NOT NULL,
        classification_id INTEGER REFERENCES classification (classification_id)
    );

CREATE TABLE
    IF NOT EXISTS account (
        account_id SERIAL PRIMARY KEY,
        account_firstname VARCHAR(50) NOT NULL,
        account_lastname VARCHAR(50) NOT NULL,
        account_email VARCHAR(100) NOT NULL UNIQUE,
        account_password VARCHAR(255) NOT NULL,
        account_type account_type DEFAULT 'Client'
    );

-- Insert sample data
INSERT INTO
    classification (classification_name)
VALUES
    ('Sport'),
    ('SUV'),
    ('Sedan'),
    ('Truck');

INSERT INTO
    inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
VALUES
    (
        'DMC',
        'Delorean',
        1985,
        'Time-travel ready with gull-wing doors',
        '/images/vehicles/delorean.jpg',
        '/images/vehicles/delorean-tn.jpg',
        25000.00,
        35000,
        'Silver',
        1
    ),
    (
        'Chevy',
        'Camaro',
        2019,
        'Sporty and fast, perfect for cruising',
        '/images/vehicles/camaro.jpg',
        '/images/vehicles/camaro-tn.jpg',
        30000.00,
        20000,
        'Red',
        1
    );