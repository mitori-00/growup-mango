-- Grow Up Mango - Supabase Database Schema
-- Supabase 대시보드 > SQL Editor에 그대로 복사해서 실행하세요.
-- 참고: 닉네임 기반 저장/불러오기는 아래 RPC 함수로 동작하므로 별도 로그인 설정 없이 바로 사용할 수 있습니다.

-- 1. 망고 상태, 인벤토리, 도감 테이블 (유저당 1행)
create table if not exists public.mango_states (
    user_id uuid primary key references auth.users(id) on delete cascade,
    nickname text not null default '망고집사',
    level integer not null default 1 check (level >= 1),
    exp integer not null default 0 check (exp >= 0),
    hunger integer not null default 70 check (hunger between 0 and 100),
    happy integer not null default 70 check (happy between 0 and 100),
    fatigue integer not null default 20 check (fatigue between 0 and 100),
    coins integer not null default 30 check (coins >= 0),
    high_score integer not null default 0 check (high_score >= 0),
    is_sleeping boolean not null default false,
    equipped_accessory text,
    equipped_theme text not null default 'theme-default',
    care_stats jsonb not null default '{"feed": 0, "play": 0, "sleep": 0}'::jsonb,
    adult_form text,
    unlocked_dex text[] not null default array['baby']::text[],
    inventory jsonb not null default '{"milk": 1}'::jsonb,
    last_active_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. 미니게임 플레이 기록 테이블 (랭킹용)
create table if not exists public.minigame_scores (
    id bigint generated always as identity primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    nickname text not null default '망고집사',
    score integer not null check (score >= 0),
    coins_earned integer not null default 0 check (coins_earned >= 0),
    survived_all boolean not null default false,
    played_at timestamptz not null default now()
);

create index if not exists idx_minigame_scores_score
    on public.minigame_scores (score desc, played_at asc);

create index if not exists idx_minigame_scores_user
    on public.minigame_scores (user_id);

-- 3. 유저별 최고 점수 기반 전체 리더보드 뷰 (상위 20명)
create or replace view public.leaderboard_top as
select
    ms.user_id,
    coalesce(m.nickname, max(ms.nickname), '망고집사') as nickname,
    max(ms.score) as best_score,
    max(ms.played_at) as last_played_at
from public.minigame_scores ms
left join public.mango_states m on m.user_id = ms.user_id
group by ms.user_id, m.nickname
order by best_score desc, last_played_at asc
limit 20;

-- 4. 닉네임 기반 클라우드 저장 테이블 (이메일 원문 대신 SHA-256 해시만 저장)
create table if not exists public.nickname_saves (
    nickname_key text primary key,
    nickname text not null,
    passkey_hash text not null,
    game_state jsonb not null,
    updated_at timestamptz not null default now()
);

-- 5. Row Level Security (RLS) 정책 설정
alter table public.mango_states enable row level security;
alter table public.minigame_scores enable row level security;
alter table public.nickname_saves enable row level security;

-- mango_states: 본인 데이터만 조회/생성/수정 가능
drop policy if exists "mango_states_select_own" on public.mango_states;
create policy "mango_states_select_own"
    on public.mango_states for select
    using (auth.uid() = user_id);

drop policy if exists "mango_states_insert_own" on public.mango_states;
create policy "mango_states_insert_own"
    on public.mango_states for insert
    with check (auth.uid() = user_id);

drop policy if exists "mango_states_update_own" on public.mango_states;
create policy "mango_states_update_own"
    on public.mango_states for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- minigame_scores: 랭킹 조회는 누구나 가능, 기록 등록은 본인만 가능
drop policy if exists "minigame_scores_select_all" on public.minigame_scores;
create policy "minigame_scores_select_all"
    on public.minigame_scores for select
    using (true);

drop policy if exists "minigame_scores_insert_own" on public.minigame_scores;
create policy "minigame_scores_insert_own"
    on public.minigame_scores for insert
    with check (auth.uid() = user_id);

-- nickname_saves는 직접 테이블 접근을 차단하고 아래 RPC 함수로만 안전하게 접근합니다.

-- 6. 닉네임 + 확인 키(이메일 해시) 기반 저장 RPC
create or replace function public.save_mango_by_nickname(
    p_nickname text,
    p_passkey_hash text,
    p_game_state jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_clean_nick text := btrim(coalesce(p_nickname, ''));
    v_key text := lower(v_clean_nick);
    v_existing_hash text;
    v_now timestamptz := now();
begin
    if char_length(v_clean_nick) < 2 or char_length(v_clean_nick) > 12 then
        return jsonb_build_object('ok', false, 'code', 'INVALID_NICKNAME');
    end if;

    if coalesce(char_length(p_passkey_hash), 0) < 16 then
        return jsonb_build_object('ok', false, 'code', 'INVALID_PASSKEY');
    end if;

    select passkey_hash
      into v_existing_hash
      from public.nickname_saves
     where nickname_key = v_key;

    if not found then
        insert into public.nickname_saves (nickname_key, nickname, passkey_hash, game_state, updated_at)
        values (v_key, v_clean_nick, p_passkey_hash, p_game_state, v_now);

        return jsonb_build_object(
            'ok', true,
            'mode', 'created',
            'nickname', v_clean_nick,
            'updated_at', v_now
        );
    end if;

    if v_existing_hash <> p_passkey_hash then
        return jsonb_build_object('ok', false, 'code', 'NICKNAME_TAKEN');
    end if;

    update public.nickname_saves
       set nickname = v_clean_nick,
           game_state = p_game_state,
           updated_at = v_now
     where nickname_key = v_key;

    return jsonb_build_object(
        'ok', true,
        'mode', 'updated',
        'nickname', v_clean_nick,
        'updated_at', v_now
    );
end;
$$;

-- 7. 닉네임 + 확인 키(이메일 해시) 기반 불러오기 RPC
create or replace function public.load_mango_by_nickname(
    p_nickname text,
    p_passkey_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_key text := lower(btrim(coalesce(p_nickname, '')));
    v_row public.nickname_saves%rowtype;
begin
    if v_key = '' then
        return jsonb_build_object('ok', false, 'code', 'INVALID_NICKNAME');
    end if;

    select *
      into v_row
      from public.nickname_saves
     where nickname_key = v_key;

    if not found then
        return jsonb_build_object('ok', false, 'code', 'NOT_FOUND');
    end if;

    if v_row.passkey_hash <> p_passkey_hash then
        return jsonb_build_object('ok', false, 'code', 'WRONG_PASSKEY');
    end if;

    return jsonb_build_object(
        'ok', true,
        'nickname', v_row.nickname,
        'game_state', v_row.game_state,
        'updated_at', v_row.updated_at
    );
end;
$$;

grant execute on function public.save_mango_by_nickname(text, text, jsonb) to anon, authenticated;
grant execute on function public.load_mango_by_nickname(text, text) to anon, authenticated;

-- 8. 등록된 사용자 닉네임 + 최고 점수 기반 전체 랭킹 조회 RPC
create or replace function public.get_nickname_leaderboard(
    p_limit integer default 20
)
returns table (
    nickname text,
    best_score integer,
    updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
    select
        ns.nickname,
        coalesce((ns.game_state->>'highScore')::integer, 0) as best_score,
        ns.updated_at
    from public.nickname_saves ns
    order by best_score desc, ns.updated_at asc
    limit greatest(1, least(coalesce(p_limit, 20), 50));
$$;

grant execute on function public.get_nickname_leaderboard(integer) to anon, authenticated;
