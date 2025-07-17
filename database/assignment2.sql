/* Query 1: Select all classifications */
SELECT
    *
FROM
    classification
ORDER BY
    classification_name;

/* Query 2: Select all vehicles from inventory */
SELECT
    *
FROM
    inventory
ORDER BY
    inv_year DESC;

/* Query 3: Select vehicles by classification name */
SELECT
    i.*
FROM
    inventory i
    JOIN classification c ON i.classification_id = c.classification_id
WHERE
    c.classification_name = 'SUV';

/* Query 4: Count vehicles per classification */
SELECT
    c.classification_name,
    COUNT(i.inv_id) as vehicle_count
FROM
    classification c
    LEFT JOIN inventory i ON c.classification_id = i.classification_id
GROUP BY
    c.classification_name
ORDER BY
    c.classification_name;

/* Query 5: Select vehicle details with classification name */
SELECT
    i.inv_make,
    i.inv_model,
    i.inv_year,
    c.classification_name
FROM
    inventory i
    JOIN classification c ON i.classification_id = c.classification_id
WHERE
    i.inv_year >= 2020
ORDER BY
    i.inv_year DESC;