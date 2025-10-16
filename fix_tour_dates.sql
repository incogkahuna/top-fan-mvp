-- Fix tour dates to be in the future (2026)
-- Since it's October 2025, we need to move the dates to 2026

UPDATE public.tour_dates 
SET date = date + INTERVAL '1 year'
WHERE date < '2025-12-31';

-- This will move all 2025 dates to 2026
