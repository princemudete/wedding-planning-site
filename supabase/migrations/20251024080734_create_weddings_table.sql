/*
  # Wedding Planning Platform Schema

  1. New Tables
    - `weddings`
      - `id` (uuid, primary key) - Unique identifier for each wedding
      - `user_id` (uuid, foreign key) - References auth.users
      - `couple_names` (text) - Names of the couple
      - `wedding_date` (date) - Date of the wedding
      - `venue` (text) - Wedding venue name/location
      - `guest_count` (integer) - Expected number of guests
      - `budget` (numeric) - Wedding budget amount
      - `theme` (text) - Wedding theme/style
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on `weddings` table
    - Add policy for authenticated users to view their own weddings
    - Add policy for authenticated users to insert their own weddings
    - Add policy for authenticated users to update their own weddings
    - Add policy for authenticated users to delete their own weddings
*/

CREATE TABLE IF NOT EXISTS weddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  couple_names text NOT NULL,
  wedding_date date NOT NULL,
  venue text NOT NULL,
  guest_count integer DEFAULT 0,
  budget numeric(10, 2),
  theme text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weddings"
  ON weddings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weddings"
  ON weddings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weddings"
  ON weddings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weddings"
  ON weddings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS weddings_user_id_idx ON weddings(user_id);
CREATE INDEX IF NOT EXISTS weddings_wedding_date_idx ON weddings(wedding_date);