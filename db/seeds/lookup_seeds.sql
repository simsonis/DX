-- Seed data for lookup tables and example law

insert into law_type(type_code, description) values
('act','국회 제정 법률') on conflict do nothing;

insert into relation_type(rel_code, priority) values
('SPECIAL_RULE_OF',10),('AMENDS',20),('BASED_ON',30),('APPLIES_TO',40),('CITES',50),('REFERS_TO',60)
on conflict do nothing;

insert into law(law_key, official_title_ko, type_code)
values ('pipa','개인정보 보호법','act')
on conflict do nothing;

insert into law_version(law_id, expression_date, is_consolidated, effective_from, lang, frbr_expression_iri)
select law_id, date '2024-11-30', true, date '2024-11-30', 'ko',
       make_law_expr_iri('act','pipa','2024-11-30'::date,'ko')
from law where law_key='pipa';
