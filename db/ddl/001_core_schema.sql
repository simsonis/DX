-- Core schema for ontology-based Korean law DB
-- Includes extensions, lookup tables, law structures, case structures, relations, definitions, RAG chunks and logging tables

-- Extensions
create extension if not exists ltree;
create extension if not exists pg_trgm;
-- Optional: create extension if not exists vector; -- pgvector

-- Lookup tables
create table if not exists law_type (
  type_code text primary key,
  description text
);

create table if not exists relation_type (
  rel_code text primary key,
  priority int not null
);

-- Law tables
create table if not exists law (
  law_id bigserial primary key,
  law_key text unique,
  official_title_ko text not null,
  official_title_en text,
  type_code text not null references law_type(type_code),
  created_at timestamp default now()
);

create table if not exists law_version (
  version_id bigserial primary key,
  law_id bigint not null references law(law_id) on delete cascade,
  expression_date date not null,
  lang text not null default 'ko',
  is_consolidated boolean not null default true,
  promulgation_date date,
  enforcement_date date,
  effective_from date not null,
  effective_to date,
  frbr_work_iri text,
  frbr_expression_iri text unique,
  source_id bigint,
  checksum text,
  unique(law_id, expression_date, lang, is_consolidated)
);

-- Article node tree
create table if not exists article_node (
  node_id bigserial primary key,
  law_id bigint not null references law(law_id) on delete cascade,
  version_id bigint not null references law_version(version_id) on delete cascade,
  node_type text not null check (node_type in ('ARTICLE','PARAGRAPH','ITEM','SUBITEM')),
  number_norm text,
  title text,
  hierarchy_path ltree not null,
  component_iri text unique,
  uriname text,
  effective_from date not null,
  effective_to date,
  law_level text,
  created_at timestamp default now(),
  unique(version_id, hierarchy_path)
);

create table if not exists article_text (
  node_id bigint primary key references article_node(node_id) on delete cascade,
  plain_text text not null,
  html_text text,
  source_manifestation_id bigint,
  updated_at timestamp default now()
);
create index if not exists article_text_plain_text_trgm_idx on article_text using gin (plain_text gin_trgm_ops);

-- Case structures
create table if not exists court (
  court_slug text primary key,
  full_name text
);

create table if not exists case_work (
  case_id bigserial primary key,
  court_slug text not null references court(court_slug),
  case_no text not null,
  title text,
  frbr_work_iri text unique,
  unique(court_slug, case_no)
);

create table if not exists case_expression (
  case_expr_id bigserial primary key,
  case_id bigint not null references case_work(case_id) on delete cascade,
  decision_date date not null,
  lang text not null default 'ko',
  frbr_expression_iri text unique,
  source_id bigint
);

create table if not exists case_paragraph (
  para_id bigserial primary key,
  case_expr_id bigint not null references case_expression(case_expr_id) on delete cascade,
  para_no int not null,
  hierarchy_path ltree not null,
  component_iri text unique,
  plain_text text not null,
  html_text text
);
create index if not exists case_paragraph_plain_text_trgm_idx on case_paragraph using gin (plain_text gin_trgm_ops);

-- Object relations
create table if not exists object_relation (
  rel_id bigserial primary key,
  src_component_iri text not null,
  dst_component_iri text not null,
  rel_code text not null references relation_type(rel_code),
  evidence jsonb,
  confidence real check (confidence between 0 and 1),
  created_at timestamp default now()
);
create index if not exists object_relation_rel_code_idx on object_relation (rel_code);
create index if not exists object_relation_evidence_idx on object_relation using gin (evidence);
create index if not exists object_relation_src_idx on object_relation (src_component_iri);
create index if not exists object_relation_dst_idx on object_relation (dst_component_iri);

-- Term definitions
create table if not exists term_definition (
  term_id bigserial primary key,
  law_id bigint not null references law(law_id) on delete cascade,
  version_id bigint not null references law_version(version_id) on delete cascade,
  term_text text not null,
  defining_component_iri text not null,
  definition_text text not null,
  created_at timestamp default now(),
  unique(version_id, term_text)
);
create index if not exists term_definition_term_text_trgm_idx on term_definition using gin (term_text gin_trgm_ops);

-- RAG chunks
create table if not exists rag_chunk (
  chunk_id bigserial primary key,
  component_iri text not null,
  chunk_type text not null check (chunk_type in ('ARTICLE','PARAGRAPH','ITEM','CASE_PARA')),
  text text not null,
  law_id bigint,
  version_id bigint,
  law_level text,
  effective_from date,
  effective_to date,
  point_in_time date
  -- Optional embedding column can be added with pgvector
);
create index if not exists rag_chunk_text_trgm_idx on rag_chunk using gin (text gin_trgm_ops);

-- Source and logs
create table if not exists source (
  source_id bigserial primary key,
  provider text not null,
  url text,
  snapshot_hash text,
  fetched_at timestamp default now(),
  license text
);

create table if not exists import_log (
  import_id bigserial primary key,
  source_id bigint references source(source_id),
  target_table text not null,
  rowcount int,
  started_at timestamp default now(),
  finished_at timestamp
);

create table if not exists validation_issue (
  issue_id bigserial primary key,
  severity text check (severity in ('ERROR','WARN','INFO')),
  category text,
  target_iri text,
  detail jsonb,
  created_at timestamp default now()
);

