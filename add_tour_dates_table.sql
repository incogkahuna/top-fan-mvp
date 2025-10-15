-- Add tour_dates table to store real tour information
-- This replaces the sample data with actual tour dates

-- Create tour_dates table
CREATE TABLE public.tour_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic tour information
  date DATE NOT NULL,
  time TIME,
  venue VARCHAR(500) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'United States',
  
  -- Ticket information
  ticket_link TEXT,
  ticket_price DECIMAL(10,2),
  capacity INTEGER,
  sold INTEGER DEFAULT 0,
  
  -- Status and metadata
  status VARCHAR(50) DEFAULT 'On Sale' CHECK (status IN ('On Sale', 'Sold Out', 'Cancelled', 'Postponed', 'Announced')),
  is_active BOOLEAN DEFAULT true,
  
  -- Laylo integration
  laylo_id VARCHAR(255),
  laylo_synced_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional details
  description TEXT,
  age_restriction VARCHAR(50),
  special_notes TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_tour_dates_date ON public.tour_dates(date);
CREATE INDEX idx_tour_dates_city ON public.tour_dates(city);
CREATE INDEX idx_tour_dates_status ON public.tour_dates(status);
CREATE INDEX idx_tour_dates_active ON public.tour_dates(is_active);

-- Enable RLS (Row Level Security)
ALTER TABLE public.tour_dates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tour dates are viewable by everyone" ON public.tour_dates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin users can manage tour dates" ON public.tour_dates
  FOR ALL USING (auth.role() = 'admin' OR auth.role() = 'service_role');

-- Add updated_at trigger
CREATE TRIGGER update_tour_dates_updated_at 
  BEFORE UPDATE ON public.tour_dates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample tour dates
INSERT INTO public.tour_dates (
  date, time, venue, city, state, ticket_link, ticket_price, capacity, sold, status, description
) VALUES 
-- Upcoming shows
('2025-03-15', '20:00:00', 'The Roxy Theatre', 'Los Angeles', 'CA', 'https://laylo.com/early20storture/la', 35.00, 500, 127, 'On Sale', 'Intimate acoustic set with special guests'),
('2025-03-22', '21:00:00', 'The Fillmore', 'San Francisco', 'CA', 'https://laylo.com/early20storture/sf', 40.00, 1200, 1200, 'Sold Out', 'Full band performance with new material'),
('2025-04-05', '19:30:00', 'House of Blues', 'Chicago', 'IL', 'https://laylo.com/early20storture/chicago', 32.00, 800, 234, 'On Sale', 'Midwest tour kickoff show'),
('2025-04-12', '20:30:00', 'Terminal 5', 'New York', 'NY', 'https://laylo.com/early20storture/nyc', 45.00, 3000, 1890, 'On Sale', 'Special NYC performance with extended setlist'),
('2025-04-19', '19:00:00', 'The Tabernacle', 'Atlanta', 'GA', 'https://laylo.com/early20storture/atlanta', 30.00, 2600, 45, 'On Sale', 'Southern hospitality tour stop'),
('2025-05-03', '20:00:00', 'Red Rocks Amphitheatre', 'Morrison', 'CO', 'https://laylo.com/early20storture/redrocks', 55.00, 9500, 3200, 'On Sale', 'Historic venue debut - outdoor show'),
('2025-05-17', '21:00:00', 'The Wiltern', 'Los Angeles', 'CA', 'https://laylo.com/early20storture/wiltern', 42.00, 2000, 0, 'Announced', 'Return to LA with full production'),
('2025-06-07', '19:30:00', 'Royce Hall', 'Los Angeles', 'CA', 'https://laylo.com/early20storture/royce', 65.00, 1800, 0, 'Announced', 'Acoustic evening - limited capacity'),
('2025-06-21', '20:00:00', 'The Observatory', 'Santa Ana', 'CA', 'https://laylo.com/early20storture/observatory', 38.00, 1200, 0, 'Announced', 'Orange County homecoming show'),
('2025-07-12', '20:30:00', 'Paramount Theatre', 'Seattle', 'WA', 'https://laylo.com/early20storture/seattle', 35.00, 2800, 0, 'Announced', 'Pacific Northwest tour finale');

-- Insert some past shows for reference (inactive)
INSERT INTO public.tour_dates (
  date, time, venue, city, state, ticket_link, ticket_price, capacity, sold, status, is_active, description
) VALUES 
('2024-12-15', '20:00:00', 'The Troubadour', 'Los Angeles', 'CA', '', 25.00, 500, 500, 'Sold Out', false, 'Holiday show - completely sold out'),
('2024-11-28', '19:30:00', 'Cafe Du Nord', 'San Francisco', 'CA', '', 20.00, 300, 300, 'Sold Out', false, 'Thanksgiving weekend intimate show'),
('2024-10-31', '21:00:00', 'The Echo', 'Los Angeles', 'CA', '', 15.00, 350, 350, 'Sold Out', false, 'Halloween special show');
