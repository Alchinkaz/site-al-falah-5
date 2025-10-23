-- Add slug column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);

-- Generate slugs for existing projects based on their titles
UPDATE projects
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- If title is empty, use id as slug
UPDATE projects
SET slug = id
WHERE slug IS NULL OR slug = '';
