-- V3__catalog_specializations.sql
-- Catalog for psychologist specializations (idempotent)

CREATE TABLE IF NOT EXISTS catalog_specializations (
  code VARCHAR(64) PRIMARY KEY,
  name_en VARCHAR(200) NOT NULL,
  name_ru VARCHAR(200) NOT NULL,
  name_hy VARCHAR(200) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Seed base catalog (idempotent)
INSERT INTO catalog_specializations (code, name_en, name_ru, name_hy, active)
SELECT v.code, v.name_en, v.name_ru, v.name_hy, TRUE
FROM (VALUES
  ('anxiety',       'Anxiety',          'Тревожность',        'Տագնապ'),
  ('depression',    'Depression',       'Депрессия',          'Դեպրեսիա'),
  ('relationships', 'Relationships',    'Отношения',          'Հարաբերություններ'),
  ('stress',        'Stress',           'Стресс',             'Սթրես'),
  ('self_esteem',   'Self-esteem',      'Самооценка',         'Ինքնագնահատական'),
  ('grief',         'Grief / Loss',     'Горе / утрата',      'Կորուստ / վիշտ'),
  ('trauma',        'Trauma',           'Травма',             'Տրավմա'),
  ('family',        'Family issues',    'Семейные вопросы',   'Ընտանեկան խնդիրներ'),
  ('addiction',     'Addiction',        'Зависимость',        'Կախվածություն'),
  ('anger',         'Anger management', 'Управление гневом',  'Զայրույթի կառավարում')
) AS v(code, name_en, name_ru, name_hy)
WHERE NOT EXISTS (
  SELECT 1 FROM catalog_specializations cs WHERE cs.code = v.code
);

