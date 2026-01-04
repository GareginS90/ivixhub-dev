-- V4__catalog_therapy_methods.sql
-- Catalog for therapy methods (idempotent)

CREATE TABLE IF NOT EXISTS catalog_therapy_methods (
  code VARCHAR(64) PRIMARY KEY,
  name_en VARCHAR(200) NOT NULL,
  name_ru VARCHAR(200) NOT NULL,
  name_hy VARCHAR(200) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO catalog_therapy_methods (code, name_en, name_ru, name_hy, active)
SELECT v.code, v.name_en, v.name_ru, v.name_hy, TRUE
FROM (VALUES
  ('cbt',  'Cognitive Behavioral Therapy (CBT)', 'КПТ (Когнитивно-поведенческая терапия)', 'Կոգնիտիվ-վարքաբանական թերապիա (CBT)'),
  ('act',  'Acceptance and Commitment Therapy (ACT)', 'ACT (Терапия принятия и ответственности)', 'Ընդունման և հանձնառության թերապիա (ACT)'),
  ('dbt',  'Dialectical Behavior Therapy (DBT)', 'ДПТ (Диалектическая поведенческая терапия)', 'Դիալեկտիկական վարքաբանական թերապիա (DBT)'),
  ('emdr', 'EMDR', 'EMDR', 'EMDR'),
  ('psychodynamic', 'Psychodynamic therapy', 'Психодинамическая терапия', 'Հոգեդինամիկ թերապիա'),
  ('gestalt', 'Gestalt therapy', 'Гештальт-терапия', 'Գեշտալտ թերապիա'),
  ('family_systems', 'Family systems therapy', 'Семейная системная терапия', 'Ընտանեկան համակարգային թերապիա')
) AS v(code, name_en, name_ru, name_hy)
WHERE NOT EXISTS (
  SELECT 1 FROM catalog_therapy_methods m WHERE m.code = v.code
);
