-- Add slug column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Update existing projects with slugs based on their titles
UPDATE projects SET slug = 
  CASE 
    WHEN id = 'p1' THEN 'alsad-kazakhstan-llp'
    WHEN id = 'p2' THEN 'karaganda-energocenter-llp'
    WHEN id = 'p3' THEN 'karaganda-kus-llp'
    WHEN id = 'p4' THEN 'ulmus-besshoky-jsc'
    WHEN id = 'p5' THEN 'ai-karaaul-jsc'
    WHEN id = 'p6' THEN 'elefund-vc-funds'
    ELSE LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
  END
WHERE slug IS NULL;
