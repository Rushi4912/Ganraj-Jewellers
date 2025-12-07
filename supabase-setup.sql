-- ============================================
-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- ============================================

-- 1. Create a function that creates a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'customer',
    now(),
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create a trigger that calls this function after a new user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Create profiles for existing auth users who don't have one
insert into public.profiles (id, name, role, created_at, updated_at)
select 
  au.id,
  coalesce(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  'customer',
  now(),
  now()
from auth.users au
left join public.profiles p on au.id = p.id
where p.id is null;

-- 4. Update RLS policies to allow admins to read all profiles
-- First, drop existing policies if they exist
drop policy if exists "Users can view and update their own profile" on profiles;
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Anyone can insert their own profile" on profiles;

-- Create new policies
create policy "Users can view own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

create policy "Anyone can insert their own profile"
on profiles for insert
with check (auth.uid() = id);

-- Allow admins to view all profiles
create policy "Admins can view all profiles"
on profiles for select
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Allow admins to update all profiles (for role changes)
create policy "Admins can update all profiles"
on profiles for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- 5. Add RLS policies for products (allow public read, admin write)
alter table products enable row level security;

drop policy if exists "Anyone can view products" on products;
drop policy if exists "Admins can manage products" on products;

create policy "Anyone can view products"
on products for select
using (true);

create policy "Admins can insert products"
on products for insert
with check (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can update products"
on products for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can delete products"
on products for delete
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- 6. Add RLS policies for categories
alter table categories enable row level security;

drop policy if exists "Anyone can view categories" on categories;
drop policy if exists "Admins can manage categories" on categories;

create policy "Anyone can view categories"
on categories for select
using (true);

create policy "Admins can insert categories"
on categories for insert
with check (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can update categories"
on categories for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can delete categories"
on categories for delete
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- 7. Add RLS policies for orders
alter table orders enable row level security;

drop policy if exists "Users can view own orders" on orders;
drop policy if exists "Users can insert own orders" on orders;
drop policy if exists "Admins can view all orders" on orders;
drop policy if exists "Admins can update orders" on orders;

create policy "Users can view own orders"
on orders for select
using (auth.uid() = user_id);

create policy "Users can insert own orders"
on orders for insert
with check (auth.uid() = user_id);

create policy "Admins can view all orders"
on orders for select
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can update orders"
on orders for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- 8. Add RLS policies for coupons
alter table coupons enable row level security;

drop policy if exists "Anyone can view coupons" on coupons;
drop policy if exists "Admins can manage coupons" on coupons;

create policy "Anyone can view coupons"
on coupons for select
using (true);

create policy "Admins can insert coupons"
on coupons for insert
with check (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can update coupons"
on coupons for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can delete coupons"
on coupons for delete
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- 9. Add RLS policies for carts
alter table carts enable row level security;

drop policy if exists "Users can manage own cart" on carts;

create policy "Users can view own cart"
on carts for select
using (auth.uid() = user_id);

create policy "Users can insert own cart"
on carts for insert
with check (auth.uid() = user_id);

create policy "Users can update own cart"
on carts for update
using (auth.uid() = user_id);

create policy "Users can delete own cart"
on carts for delete
using (auth.uid() = user_id);

-- 10. Add RLS policies for cart_items
alter table cart_items enable row level security;

drop policy if exists "Users can manage own cart items" on cart_items;

create policy "Users can view own cart items"
on cart_items for select
using (
  exists (
    select 1 from carts
    where carts.id = cart_items.cart_id
    and carts.user_id = auth.uid()
  )
);

create policy "Users can insert own cart items"
on cart_items for insert
with check (
  exists (
    select 1 from carts
    where carts.id = cart_items.cart_id
    and carts.user_id = auth.uid()
  )
);

create policy "Users can update own cart items"
on cart_items for update
using (
  exists (
    select 1 from carts
    where carts.id = cart_items.cart_id
    and carts.user_id = auth.uid()
  )
);

create policy "Users can delete own cart items"
on cart_items for delete
using (
  exists (
    select 1 from carts
    where carts.id = cart_items.cart_id
    and carts.user_id = auth.uid()
  )
);

-- 11. Add RLS policies for reviews
alter table reviews enable row level security;

create policy "Anyone can view reviews"
on reviews for select
using (true);

create policy "Users can insert own reviews"
on reviews for insert
with check (auth.uid() = user_id);

create policy "Users can update own reviews"
on reviews for update
using (auth.uid() = user_id);

create policy "Users can delete own reviews"
on reviews for delete
using (auth.uid() = user_id);

-- 11b. Ensure new product detail columns exist (idempotent)
alter table products add column if not exists specification text;
alter table products add column if not exists supplier_info text;
alter table products add column if not exists ring_sizes text[];
alter table products add column if not exists bracelet_sizes text[];
alter table products add column if not exists payal_sizes text[];

-- 12. Verify the setup
select 'Setup complete! Profiles count: ' || count(*)::text from profiles;

