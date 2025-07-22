-- database/assignment2.sql
-- 1. Insert Tony Stark
INSERT INTO
    public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES
    (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );

-- 2. Update Tony Stark to Admin
UPDATE public.account
SET
    account_type = 'Admin'
WHERE
    account_email = 'tony@starkent.com';

-- 3. Delete Tony Stark
DELETE FROM public.account
WHERE
    account_email = 'tony@starkent.com';

-- 4. Update GM Hummer description
UPDATE public.inventory
SET
    inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE
    inv_make = 'GM'
    AND inv_model = 'Hummer';

-- 5. Select Sport category vehicles
SELECT
    i.inv_make,
    i.inv_model,
    c.classification_name
FROM
    public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE
    c.classification_name = 'Sport';

-- 6. Update image paths
UPDATE public.inventory
SET
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE
    inv_image LIKE '/images/%'
    AND inv_image NOT LIKE '/images/vehicles/%';