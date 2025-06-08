-- Category
INSERT INTO category (name, description, category_type) VALUES
('Snowboard', 'Tablas y equipamiento específico para snowboard', 'SNOWBOARD'),
('Ski', 'Esquís y material especializado para esquiar', 'SKI'),
('Accesorios', 'Complementos y accesorios para deportes de nieve', 'ACCESORY');

-- Feature
INSERT INTO features (name) VALUES
('Polivalencia'),
('Agarre'),
('Rigidez'),
('Estabilidad');

-- Roles
INSERT INTO roles (name) VALUES
('ROLE_ADMIN')
,('ROLE_CLIENT')
,('ROLE_USER');