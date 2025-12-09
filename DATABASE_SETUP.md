# Database Setup Instructions

## Problem
Getting 404 error for `/rest/v1/trips?select=*` because the database tables haven't been created yet.

## Solution: Apply the Migration

### Option 1: Via Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/ymmzjpvfbpeodmzcsfed

2. Click on **SQL Editor** in the left sidebar

3. Click **"New query"**

4. Copy the entire contents of this file: 
   `supabase/migrations/20251208171946_1a8da521-d27a-48b8-ad60-05b497c2d6a5.sql`

5. Paste into the SQL Editor and click **"Run"**

6. You should see success messages for:
   - ✅ profiles table created
   - ✅ trips table created  
   - ✅ itineraries table created
   - ✅ RLS policies enabled
   - ✅ Triggers created

### Option 2: Install Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project (you'll need your project ref and database password)
supabase link --project-ref ymmzjpvfbpeodmzcsfed

# Apply migrations
supabase db push
```

### Verify Setup

After running the migration, test in your browser console or SQL Editor:

```sql
-- Check if tables exist
SELECT * FROM public.trips LIMIT 1;
SELECT * FROM public.profiles LIMIT 1;
SELECT * FROM public.itineraries LIMIT 1;
```

Or via the Supabase client in your app:
```javascript
const { data, error } = await supabase.from('trips').select('*');
console.log(data, error);
```

## Tables Created

1. **profiles** - User profile information
2. **trips** - Trip details and preferences
3. **itineraries** - Day-by-day activity schedules

All tables have Row Level Security (RLS) enabled for data protection.
