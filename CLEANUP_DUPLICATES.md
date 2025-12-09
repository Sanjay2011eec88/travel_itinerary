# Clean Up Duplicate Trips

## Problem
Multiple duplicate trips were created during testing when itinerary generation failed.

## Solution: Delete Duplicate Trips

### Option 1: Via Supabase Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard/project/ymmzjpvfbpeodmzcsfed/editor
2. Click on the **SQL Editor**
3. Run this query to delete the duplicates:

```sql
-- Keep only the most recent trip and delete the rest
DELETE FROM trips 
WHERE id IN (
  '5f6b55d9-310b-4b53-9bee-e19afff59f95',
  '947daf90-97f6-4a82-8c75-d2a54846f622',
  'b41104de-4b75-4500-8006-d29d7431e496',
  '91848d2a-5028-4e3f-97f8-45177904e741',
  '2c2c82ed-974c-4b66-a10f-49c3f39bfafb',
  'bc77eecb-7803-4873-88c7-760a016036f4'
);
```

This will keep only the most recent trip: `1a3556e1-26b9-4fef-975d-ae619dc4311e`

### Option 2: Delete All and Start Fresh

If you want to delete ALL trips and start clean:

```sql
-- Delete all trips for this user
DELETE FROM trips WHERE user_id = '0ea58431-fb76-4b50-929b-48c7b12b071f';
```

## Fix Applied

The code has been updated to **automatically delete the trip** if itinerary generation fails. This prevents future duplicates during testing!

### What Changed:
- Trip is still created first (needed for the itinerary)
- If AI generation fails, the trip is automatically deleted
- No more orphaned trips without itineraries
