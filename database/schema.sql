CREATE TABLE
    IF NOT EXISTS classification (
        classification_id SERIAL PRIMARY KEY,
        classification_name CHARACTER VARYING NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS inventory (
        inv_id SERIAL PRIMARY KEY,
        inv_make CHARACTER VARYING NOT NULL,
        inv_model CHARACTER VARYING NOT NULL,
        inv_year INTEGER NOT NULL,
        inv_description TEXT NOT NULL,
        inv_image CHARACTER VARYING NOT NULL,
        inv_thumbnail CHARACTER VARYING NOT NULL,
        inv_price NUMERIC(9, 0) NOT NULL,
        inv_miles INTEGER NOT NULL,
        inv_color CHARACTER VARYING NOT NULL,
        classification_id INTEGER REFERENCES classification (classification_id)
    );

INSERT INTO
    classification (classification_name)
VALUES
    ('Sport'),
    ('SUV'),
    ('Sedan'),
    ('Truck');