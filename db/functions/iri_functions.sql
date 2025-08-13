-- Functions for generating IRIs and normalizing Korean references

create or replace function make_law_expr_iri(p_type text, p_key text, p_date date, p_lang text default 'ko')
returns text language sql immutable as $$
  select format('/akn/kr/%s/%s/expr/%s~%s', p_type, p_key, to_char(p_date,'YYYY-MM-DD'), p_lang);
$$;

create or replace function make_component_iri(p_expr_iri text, p_article text, p_par text, p_item text)
returns text language sql immutable as $$
  select p_expr_iri
    || case when p_article is not null then '/art-'||p_article else '' end
    || case when p_par     is not null then '/par-'||p_par     else '' end
    || case when p_item    is not null then '/item-'||p_item   else '' end;
$$;

create or replace function normalize_korean_ref(p_text text)
returns jsonb language plpgsql immutable as $$
declare art text; par text; itm text;
begin
  art := regexp_replace(p_text, '.*제([0-9]+)조(?:의([0-9]+))?.*', '\1-\2');
  art := replace(art, '-', '-');
  if art like '%-\\%' then art := replace(art, '-null', ''); end if;

  par := (regexp_matches(p_text, '제([0-9]+)항'))[1];
  itm := (regexp_matches(p_text, '제([0-9]+)호'))[1];

  return jsonb_build_object('article', nullif(art,''),
                            'paragraph', par,
                            'item', itm);
end $$;
