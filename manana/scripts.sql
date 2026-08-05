CREATE USER produccion_user WITH PASSWORD 'admin123';
CREATE DATABASE produccion_db OWNER produccion_user;

\c produccion_db

ALTER SCHEMA public OWNER TO produccion_user;
GRANT ALL ON SCHEMA public TO produccion_user;
GRANT CREATE ON SCHEMA public TO produccion_user;

ALTER DEFAULT PRIVILEGES FOR USER produccion_user IN SCHEMA public
GRANT ALL ON TABLES TO produccion_user;

ALTER DEFAULT PRIVILEGES FOR USER produccion_user IN SCHEMA public
GRANT ALL ON SEQUENCES TO produccion_user;

ALTER DEFAULT PRIVILEGES FOR USER produccion_user IN SCHEMA public
GRANT ALL ON FUNCTIONS TO produccion_user;


Nombre de usuario (leave blank to use 'higueraf'): higueraf
Dirección de correo electrónico: francisco.higuera@ute.edu.ec  
Password: 
Password (again): 
Superuser created successfully.