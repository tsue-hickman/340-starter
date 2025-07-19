/* Drop tables and types if they exist */
DROP TABLE IF EXISTS account;

DROP TABLE IF EXISTS inventory;

DROP TABLE IF EXISTS classification;

DROP TYPE IF EXISTS account_type;

/* Create account_type ENUM */
CREATE TYPE account_type AS ENUM ('Client', 'Employee', 'Admin');

/* Create classification table */
CREATE TABLE
    classification (
        classification_id SERIAL PRIMARY KEY,
        classification_name VARCHAR(30) NOT NULL
    );

/* Insert classification data */
INSERT INTO
    classification (classification_name)
VALUES
    ('Sport'),
    ('SUV'),
    ('Sedan'),
    ('Truck');

/* Create inventory table */
CREATE TABLE
    inventory (
        inv_id SERIAL PRIMARY KEY,
        inv_make VARCHAR(50) NOT NULL,
        inv_model VARCHAR(50) NOT NULL,
        inv_year INTEGER NOT NULL,
        inv_description TEXT,
        inv_image VARCHAR(100),
        inv_thumbnail VARCHAR(100),
        inv_price DECIMAL(10, 2) NOT NULL,
        inv_miles INTEGER NOT NULL,
        inv_color VARCHAR(20),
        classification_id INTEGER REFERENCES classification (classification_id)
    );

/* Insert sample inventory data */
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
        'DeLorean',
        1981,
        'Iconic gull-wing doors, stainless steel body',
        '/images/vehicles/delorean.jpg',
        '/images/vehicles/delorean-tn.jpg',
        25000.00,
        45000,
        'Silver',
        1
    ),
    (
        'Toyota',
        'RAV4',
        2021,
        'Reliable compact SUV',
        '/images/vehicles/rav4.jpg',
        '/images/vehicles/rav4-tn.jpg',
        28000.00,
        15000,
        'Blue',
        2
    ),
    (
        'Honda',
        'Civic',
        2022,
        'Fuel-efficient sedan',
        '/images/vehicles/civic.jpg',
        '/images/vehicles/civic-tn.jpg',
        22000.00,
        10000,
        'White',
        3
    ),
    (
        'Ford',
        'F-150',
        2020,
        'Heavy-duty pickup truck',
        '/images/vehicles/f150.jpg',
        '/images/vehicles/f150-tn.jpg',
        35000.00,
        20000,
        'Red',
        4
    );

/* Create account table */
CREATE TABLE
    account (
        account_id SERIAL PRIMARY KEY,
        account_firstname VARCHAR NOT NULL,
        account_lastname VARCHAR NOT NULL,
        account_email VARCHAR NOT NULL,
        account_password VARCHAR NOT NULL,
        account_type account_type NOT NULL DEFAULT 'Client'
    );