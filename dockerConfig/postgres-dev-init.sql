CREATE USER ltm with encrypted password 'ltm-password';
CREATE DATABASE ltm_inventory;
GRANT ALL PRIVILEGES ON DATABASE ltm_inventory TO ltm;
