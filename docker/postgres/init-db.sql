SELECT 'CREATE DATABASE ecoconnect_lima'
WHERE NOT EXISTS (
    SELECT 1
    FROM pg_database
    WHERE datname = 'ecoconnect_lima'
)
\gexec

SELECT 'CREATE DATABASE ecoconnect_arequipa'
WHERE NOT EXISTS (
    SELECT 1
    FROM pg_database
    WHERE datname = 'ecoconnect_arequipa'
)
\gexec

SELECT 'CREATE DATABASE ecoconnect_trujillo'
WHERE NOT EXISTS (
    SELECT 1
    FROM pg_database
    WHERE datname = 'ecoconnect_trujillo'
)
\gexec