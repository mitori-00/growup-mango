-- Grow Up Mango - Supabase Database Schema
-- Supabase 대시보드 > SQL Editor에 그대로 복사해서 실행하세요.
-- 참고: Authentication > Providers > Anonymous Sign-Ins 를 활성화하면 별도 회원가입 없이 자동 저장됩니다.

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

-- 4. Row Level Security (RLS) 정책 설정
alter table public.mango_states enable row level security;
alter table public.minigame_scores enable row level security;

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
