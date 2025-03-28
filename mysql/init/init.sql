CREATE DATABASE IF NOT EXISTS casbin;
CREATE DATABASE IF NOT EXISTS fiber;

GRANT CREATE, ALTER, INDEX, LOCK TABLES, REFERENCES, UPDATE, DELETE, DROP, SELECT, INSERT ON `casbin`.* TO 'orda'@'%';
GRANT CREATE, ALTER, INDEX, LOCK TABLES, REFERENCES, UPDATE, DELETE, DROP, SELECT, INSERT ON `fiber`.* TO 'orda'@'%';

FLUSH PRIVILEGES;
