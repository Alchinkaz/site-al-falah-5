# Supabase Migration Plan for Al Falah Capital Partners Website

## Overview
This document outlines the complete migration from localStorage to Supabase for the Al Falah Capital Partners website. The migration will replace all client-side storage with a robust PostgreSQL database hosted on Supabase.

## Supabase Configuration
- **URL**: https://rgqrysszglihhlrblcdo.supabase.co
- **ANON KEY**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncXJ5c3N6Z2xpaGhscmJsY2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTYzMzgsImV4cCI6MjA3NjE5MjMzOH0.IBk4gFdrwWsRjJenh3cMnpmeFGarKB6HA-XLdqriAOw

## Current localStorage Data Analysis

### 1. Admin Storage (`lib/admin-storage.ts`)
- **admin_users**: User authentication data
- **admin_orders**: Order management (currently unused)
- **admin_news**: Portfolio projects/articles
- **admin_projects**: Additional project data (currently unused)
- **current_user**: Current session data
- **admin_token**: Authentication token

### 2. Homepage Data (`lib/homepage-data.tsx`)
- **homepage-data**: Main website configuration
- **heroImage**: Hero background image
- **mobileMenuBg**: Mobile menu background
- **footerBg**: Footer background
- **aboutImage**: About section image
- **statistics**: Site statistics
- **reviews**: Customer reviews
- **imageGallery**: Image gallery
- **faqItems**: FAQ items
- **contactsSection**: Contact information
- **currencyRates**: Currency/performance data
- **portfolioItems**: Portfolio items
- **tickerTexts**: Scrolling text

### 3. Internationalization (`lib/i18n.ts`)
- **i18n-translations**: All multilingual content
- **lang**: Current language preference
- **projectTexts**: Project-specific translations
- **projectBadgesI18n**: Badge translations
- **projectSections**: Content section translations
- **teamI18n**: Team member translations
- **teamNames**: Team member names
- **teamPhotos**: Team member photos

## Database Schema Design

### Core Tables

#### 1. Users Table
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
\`\`\`

#### 2. Projects Table (Portfolio Projects)
\`\`\`sql
CREATE TABLE projects (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  image VARCHAR(500),
  content_image VARCHAR(500),
  images JSONB DEFAULT '[]',
  badges JSONB DEFAULT '[]',
  investment_year INTEGER,
  content_sections JSONB DEFAULT '[]',
  published BOOLEAN DEFAULT false,
  show_on_homepage BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_homepage ON projects(show_on_homepage);
CREATE INDEX idx_projects_created_at ON projects(created_at);
\`\`\`

#### 3. Homepage Configuration Table
\`\`\`sql
CREATE TABLE homepage_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO homepage_config (key, value) VALUES 
('hero', '{"title": "Empowering Innovation Through Strategic Venture Investment", "subtitle": "We partner with visionary entrepreneurs and groundbreaking startups to build the future. From seed to scale, we provide capital, expertise, and networks to transform ideas into market leaders.", "buttonText": "View Portfolio", "buttonLink": "https://wa.me/77053333082", "image": "/hero-bg.jpg"}'),
('mobile_menu_bg', '{"image": "/hero-bg.jpg"}'),
('footer_bg', '{"image": "/hero-bg.jpg"}'),
('about', '{"image": "/placeholder.svg", "text": "Building Tomorrow''s Success Stories Today", "description": "We are a leading venture capital firm focused on identifying and nurturing exceptional startups across technology, healthcare, and sustainable innovation sectors."}'),
('statistics', '{"stat1": {"title": "$50M+", "subtitle": "Assets Under Management"}, "stat2": {"title": "25+", "subtitle": "Portfolio Companies"}, "stat3": {"title": "15+", "subtitle": "Successful Exits"}}'),
('reviews', '[]'),
('image_gallery', '[]'),
('faq_items', '[]'),
('contacts', '{"phone": "+7 (777) 323-17-15", "email": "shotkin.azat@gmail.com", "buttonText": "Schedule Meeting", "buttonLink": "https://wa.me/77053333082", "mapIframe": ""}'),
('currency_rates', '[]'),
('portfolio_items', '[]'),
('ticker_texts', '[]'),
('footer', '{"email": "altay@falahpartners.com", "copyright": "© 2025 Al Falah Capital Partners"}');
\`\`\`

#### 4. Translations Table
\`\`\`sql
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL,
  language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'ru', 'kz')),
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(key, language)
);

-- Create indexes
CREATE INDEX idx_translations_key ON translations(key);
CREATE INDEX idx_translations_language ON translations(language);
\`\`\`

#### 5. Project Translations Table
\`\`\`sql
CREATE TABLE project_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
  translation_type VARCHAR(50) NOT NULL CHECK (translation_type IN ('title', 'badges', 'sections')),
  language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'ru', 'kz')),
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, translation_type, language)
);

-- Create indexes
CREATE INDEX idx_project_translations_project_id ON project_translations(project_id);
CREATE INDEX idx_project_translations_type ON project_translations(translation_type);
\`\`\`

#### 6. Team Members Table
\`\`\`sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  photo VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default team members
INSERT INTO team_members (slug, photo) VALUES 
('nurlan-kussainov', '/placeholder.svg'),
('diyar-medeubekov', '/placeholder.svg'),
('altay-mamanbayev', '/placeholder.svg'),
('azhar-babayeva', '/placeholder.svg');
\`\`\`

#### 7. Team Translations Table
\`\`\`sql
CREATE TABLE team_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_slug VARCHAR(100) REFERENCES team_members(slug) ON DELETE CASCADE,
  translation_type VARCHAR(50) NOT NULL CHECK (translation_type IN ('name', 'role', 'bio_left', 'bio_right')),
  language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'ru', 'kz')),
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_member_slug, translation_type, language)
);

-- Create indexes
CREATE INDEX idx_team_translations_slug ON team_translations(team_member_slug);
CREATE INDEX idx_team_translations_type ON team_translations(translation_type);
\`\`\`

#### 8. User Sessions Table
\`\`\`sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
\`\`\`

### Row Level Security (RLS) Policies

\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read access for published projects" ON projects
  FOR SELECT USING (published = true);

CREATE POLICY "Public read access for homepage config" ON homepage_config
  FOR SELECT USING (true);

CREATE POLICY "Public read access for translations" ON translations
  FOR SELECT USING (true);

CREATE POLICY "Public read access for project translations" ON project_translations
  FOR SELECT USING (true);

CREATE POLICY "Public read access for team members" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "Public read access for team translations" ON team_translations
  FOR SELECT USING (true);

-- Admin full access (will be implemented with JWT auth)
CREATE POLICY "Admin full access to projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to homepage config" ON homepage_config
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to translations" ON translations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to project translations" ON project_translations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to team members" ON team_members
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to team translations" ON team_translations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to users" ON users
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to user sessions" ON user_sessions
  FOR ALL USING (auth.role() = 'authenticated');
\`\`\`

## Migration Steps

### Phase 1: Setup and Configuration

1. **Install Supabase Client**
   \`\`\`bash
   npm install @supabase/supabase-js
   \`\`\`

2. **Create Supabase Client Configuration**
   \`\`\`typescript
   // lib/supabase.ts
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = 'https://rgqrysszglihhlrblcdo.supabase.co'
   const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncXJ5c3N6Z2xpaGhscmJsY2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTYzMzgsImV4cCI6MjA3NjE5MjMzOH0.IBk4gFdrwWsRjJenh3cMnpmeFGarKB6HA-XLdqriAOw'
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   \`\`\`

3. **Create Database Schema**
   - Execute all SQL commands above in Supabase SQL Editor
   - Verify all tables are created correctly
   - Test RLS policies

### Phase 2: Data Migration

1. **Migrate Default Projects**
   \`\`\`sql
   -- Insert the 6 default projects
   INSERT INTO projects (id, title, description, content, badges, investment_year, content_sections, published, show_on_homepage, created_at) VALUES
   ('p1', 'Alsad Kazakhstan LLP', 'Not operating and pre-bankrupt farm has been turned into the market leader in egg production reaching full capacity of 160 millions high quality eggs per year with a 20% market niche in Almaty region.', 'Not operating and pre-bankrupt farm has been turned into the market leader in egg production reaching full capacity of 160 millions high quality eggs per year with a 20% market niche in Almaty region.', '[{"label": "Agriculture", "color": "#16a34a"}, {"label": "Turnaround", "color": "#ea580c"}]', 2012, '[{"title": "Overview", "text": "Not operating and pre-bankrupt farm has been turned into the market leader in egg production reaching full capacity of 160 millions high quality eggs per year with a 20% market niche in Almaty region."}]', true, true, '2012-01-01T00:00:00Z'),
   ('p2', 'Karaganda Energocenter LLP', 'Investment has been used to support expansion program through the construction of new 120MW energy block to cover regional power deficit, total installed capacity has reached 712MW by the end of 2015.', 'Investment has been used to support expansion program through the construction of new 120MW energy block to cover regional power deficit, total installed capacity has reached 712MW by the end of 2015.', '[{"label": "Energy", "color": "#0ea5e9"}, {"label": "Growth", "color": "#7c3aed"}]', 2012, '[{"title": "Overview", "text": "Investment has been used to support expansion program through the construction of new 120MW energy block to cover regional power deficit, total installed capacity has reached 712MW by the end of 2015."}]', true, true, '2012-01-01T00:00:00Z'),
   ('p3', 'Karaganda Kus LLP', 'Further expansion of Alsad expertise to Karaganda region by attracting external funding and combined egg production business became the market leader in Kazakhstan with 300 million eggs capacity.', 'Further expansion of Alsad expertise to Karaganda region by attracting external funding and combined egg production business became the market leader in Kazakhstan with 300 million eggs capacity.', '[{"label": "Agriculture", "color": "#16a34a"}, {"label": "LBO", "color": "#dc2626"}]', 2017, '[{"title": "Overview", "text": "Further expansion of Alsad expertise to Karaganda region by attracting external funding and combined egg production business became the market leader in Kazakhstan with 300 million eggs capacity."}]', true, true, '2017-01-01T00:00:00Z'),
   ('p4', 'Ulmus Besshoky JSC', 'Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 1,167K tons of copper', 'Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 1,167K tons of copper', '[{"label": "Mining", "color": "#6b7280"}, {"label": "Greenfield", "color": "#059669"}]', 2015, '[{"title": "Overview", "text": "Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 1,167K tons of copper"}]', true, false, '2015-01-01T00:00:00Z'),
   ('p5', 'Ai Karaaul JSC', 'Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 180K tons of high grade copper', 'Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 180K tons of high grade copper', '[{"label": "Mining", "color": "#6b7280"}, {"label": "Greenfield", "color": "#059669"}]', 2008, '[{"title": "Overview", "text": "Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 180K tons of high grade copper"}]', true, false, '2008-01-01T00:00:00Z'),
   ('p6', 'Elefund VC funds', 'Investments were made in several consecutive VC funds that has a management team of world class operators and investors who strive for excellence and impact by building a new world of highly profitable businesses', 'Investments were made in several consecutive VC funds that has a management team of world class operators and investors who strive for excellence and impact by building a new world of highly profitable businesses', '[{"label": "Venture Capital", "color": "#2563eb"}, {"label": "Funds", "color": "#9333ea"}]', 2017, '[{"title": "Overview", "text": "Investments were made in several consecutive VC funds that has a management team of world class operators and investors who strive for excellence and impact by building a new world of highly profitable businesses"}]', true, true, '2017-01-01T00:00:00Z');
   \`\`\`

2. **Migrate Project Translations**
   \`\`\`sql
   -- Insert project title translations
   INSERT INTO project_translations (project_id, translation_type, language, value) VALUES
   ('p1', 'title', 'en', '"Alsad Kazakhstan LLP"'),
   ('p1', 'title', 'ru', '"Алсад Казахстан ТОО"'),
   ('p1', 'title', 'kz', '"Alsad Kazakhstan ЖШС"'),
   ('p2', 'title', 'en', '"Karaganda Energocenter LLP"'),
   ('p2', 'title', 'ru', '"Караганда Энергоцентр ТОО"'),
   ('p2', 'title', 'kz', '"Қарағанды Энергоцентр ЖШС"'),
   -- ... continue for all projects
   ;
   
   -- Insert badge translations
   INSERT INTO project_translations (project_id, translation_type, language, value) VALUES
   ('p1', 'badges', 'en', '[{"en": "Agriculture", "ru": "Сельское хозяйство", "kz": "Ауыл шаруашылығы"}, {"en": "Turnaround", "ru": "Оздоровление", "kz": "Беті қайтару"}]'),
   ('p1', 'badges', 'ru', '[{"en": "Agriculture", "ru": "Сельское хозяйство", "kz": "Ауыл шаруашылығы"}, {"en": "Turnaround", "ru": "Оздоровление", "kz": "Беті қайтару"}]'),
   ('p1', 'badges', 'kz', '[{"en": "Agriculture", "ru": "Сельское хозяйство", "kz": "Ауыл шаруашылығы"}, {"en": "Turnaround", "ru": "Оздоровление", "kz": "Беті қайтару"}]'),
   -- ... continue for all projects
   ;
   
   -- Insert section translations
   INSERT INTO project_translations (project_id, translation_type, language, value) VALUES
   ('p1', 'sections', 'en', '[{"title": "Overview", "text": "Not operating and pre-bankrupt farm has been turned into the market leader in egg production reaching full capacity of 160 millions high quality eggs per year with a 20% market niche in Almaty region."}]'),
   ('p1', 'sections', 'ru', '[{"title": "Обзор", "text": "Неработающая ферма на грани банкротства была превращена в лидера рынка по производству яиц с мощностью 160 млн качественных яиц в год и долей 20% в Алматинском регионе."}]'),
   ('p1', 'sections', 'kz', '[{"title": "Шолу", "text": "Банкроттық алдында тұрған жұмыс істемейтін ферма жылына 160 млн сапалы жұмыртқа өндіретін нарық көшбасшысына айналды, Алматы өңірінде 20% үлеске жетті."}]'),
   -- ... continue for all projects
   ;
   \`\`\`

3. **Migrate Default Translations**
   \`\`\`sql
   -- Insert all default translations
   INSERT INTO translations (key, language, value) VALUES
   ('heroTitle', 'en', '"Capitalizing on Emerging Opportunities"'),
   ('heroTitle', 'ru', '"Используем возможности растущих рынков"'),
   ('heroTitle', 'kz', '"Өсіп келе жатқан мүмкіндіктерді іске асырамыз"'),
   ('heroButton', 'en', '"View Portfolio"'),
   ('heroButton', 'ru', '"Портфолио"'),
   ('heroButton', 'kz', '"Портфолио"'),
   -- ... continue for all translation keys
   ;
   \`\`\`

4. **Migrate Team Translations**
   \`\`\`sql
   -- Insert team member translations
   INSERT INTO team_translations (team_member_slug, translation_type, language, value) VALUES
   ('nurlan-kussainov', 'name', 'en', 'Nurlan Kussainov'),
   ('nurlan-kussainov', 'name', 'ru', 'Нурлан Кусаинов'),
   ('nurlan-kussainov', 'name', 'kz', 'Нұрлан Құсайынов'),
   ('nurlan-kussainov', 'role', 'en', 'Managing Partner'),
   ('nurlan-kussainov', 'role', 'ru', 'Управляющий Партнер'),
   ('nurlan-kussainov', 'role', 'kz', 'Басқарушы Серіктес'),
   -- ... continue for all team members
   ;
   \`\`\`

### Phase 3: Code Migration

1. **Create New Service Layer**
   \`\`\`typescript
   // lib/supabase-services.ts
   import { supabase } from './supabase'
   
   export class SupabaseService {
     // Projects
     static async getProjects() {
       const { data, error } = await supabase
         .from('projects')
         .select('*')
         .eq('published', true)
         .order('created_at', { ascending: false })
       return { data, error }
     }
     
     static async getProjectById(id: string) {
       const { data, error } = await supabase
         .from('projects')
         .select('*')
         .eq('id', id)
         .single()
       return { data, error }
     }
     
     static async createProject(project: any) {
       const { data, error } = await supabase
         .from('projects')
         .insert(project)
         .select()
         .single()
       return { data, error }
     }
     
     static async updateProject(id: string, updates: any) {
       const { data, error } = await supabase
         .from('projects')
         .update({ ...updates, updated_at: new Date().toISOString() })
         .eq('id', id)
         .select()
         .single()
       return { data, error }
     }
     
     static async deleteProject(id: string) {
       const { error } = await supabase
         .from('projects')
         .delete()
         .eq('id', id)
       return { error }
     }
     
     // Translations
     static async getTranslations(key?: string, language?: string) {
       let query = supabase.from('translations').select('*')
       
       if (key) query = query.eq('key', key)
       if (language) query = query.eq('language', language)
       
       const { data, error } = await query
       return { data, error }
     }
     
     static async setTranslation(key: string, language: string, value: any) {
       const { data, error } = await supabase
         .from('translations')
         .upsert({ key, language, value })
         .select()
         .single()
       return { data, error }
     }
     
     // Project Translations
     static async getProjectTranslations(projectId: string, type?: string, language?: string) {
       let query = supabase
         .from('project_translations')
         .select('*')
         .eq('project_id', projectId)
       
       if (type) query = query.eq('translation_type', type)
       if (language) query = query.eq('language', language)
       
       const { data, error } = await query
       return { data, error }
     }
     
     static async setProjectTranslation(projectId: string, type: string, language: string, value: any) {
       const { data, error } = await supabase
         .from('project_translations')
         .upsert({ project_id: projectId, translation_type: type, language, value })
         .select()
         .single()
       return { data, error }
     }
     
     // Homepage Config
     static async getHomepageConfig(key?: string) {
       let query = supabase.from('homepage_config').select('*')
       
       if (key) query = query.eq('key', key)
       
       const { data, error } = await query
       return { data, error }
     }
     
     static async setHomepageConfig(key: string, value: any) {
       const { data, error } = await supabase
         .from('homepage_config')
         .upsert({ key, value })
         .select()
         .single()
       return { data, error }
     }
     
     // Team Members
     static async getTeamMembers() {
       const { data, error } = await supabase
         .from('team_members')
         .select('*')
       return { data, error }
     }
     
     static async getTeamTranslations(slug?: string, type?: string, language?: string) {
       let query = supabase.from('team_translations').select('*')
       
       if (slug) query = query.eq('team_member_slug', slug)
       if (type) query = query.eq('translation_type', type)
       if (language) query = query.eq('language', language)
       
       const { data, error } = await query
       return { data, error }
     }
     
     static async setTeamTranslation(slug: string, type: string, language: string, value: string) {
       const { data, error } = await supabase
         .from('team_translations')
         .upsert({ team_member_slug: slug, translation_type: type, language, value })
         .select()
         .single()
       return { data, error }
     }
     
     // Authentication
     static async authenticateUser(username: string, password: string) {
       // This will need to be implemented with proper password hashing
       const { data, error } = await supabase
         .from('users')
         .select('*')
         .eq('username', username)
         .single()
       
       if (error || !data) return { data: null, error }
       
       // Verify password (implement proper bcrypt verification)
       // For now, using simple comparison (NOT SECURE - needs proper implementation)
       if (data.password_hash === password) {
         return { data, error: null }
       }
       
       return { data: null, error: { message: 'Invalid credentials' } }
     }
   }
   \`\`\`

2. **Update Components to Use Supabase**

   **Replace `lib/admin-storage.ts`:**
   \`\`\`typescript
   // lib/admin-storage-supabase.ts
   import { SupabaseService } from './supabase-services'
   
   export class AdminStorage {
     static async getNewsArticles() {
       const { data, error } = await SupabaseService.getProjects()
       if (error) {
         console.error('Error getting projects:', error)
         return []
       }
       return data || []
     }
     
     static async setNewsArticles(articles: any[]) {
       // This will need to be implemented as batch operations
       for (const article of articles) {
         await SupabaseService.updateProject(article.id, article)
       }
     }
     
     static async addNewsArticle(article: any) {
       const { data, error } = await SupabaseService.createProject(article)
       return { data, error }
     }
     
     static async updateNewsArticle(id: string, updates: any) {
       const { data, error } = await SupabaseService.updateProject(id, updates)
       return { data, error }
     }
     
     static async deleteNewsArticle(id: string) {
       const { error } = await SupabaseService.deleteProject(id)
       return { error }
     }
     
     // ... implement other methods
   }
   \`\`\`

   **Replace `lib/homepage-data.tsx`:**
   \`\`\`typescript
   // lib/homepage-data-supabase.tsx
   import { SupabaseService } from './supabase-services'
   
   export async function getHomepageData() {
     const { data, error } = await SupabaseService.getHomepageConfig()
     if (error) {
       console.error('Error getting homepage config:', error)
       return defaultHomepageData
     }
     
     // Transform data from database format to expected format
     const config: any = {}
     data?.forEach((item: any) => {
       config[item.key] = item.value
     })
     
     return { ...defaultHomepageData, ...config }
   }
   
   export async function updateHomepageData(data: any) {
     const updates = Object.entries(data).map(([key, value]) => 
       SupabaseService.setHomepageConfig(key, value)
     )
     
     await Promise.all(updates)
   }
   \`\`\`

   **Replace `lib/i18n.ts`:**
   \`\`\`typescript
   // lib/i18n-supabase.ts
   import { SupabaseService } from './supabase-services'
   
   export async function getTranslations(key?: string, language?: string) {
     const { data, error } = await SupabaseService.getTranslations(key, language)
     if (error) {
       console.error('Error getting translations:', error)
       return null
     }
     
     // Transform data to expected format
     const translations: any = {}
     data?.forEach((item: any) => {
       if (!translations[item.key]) {
         translations[item.key] = {}
       }
       translations[item.key][item.language] = item.value
     })
     
     return translations
   }
   
   export async function setTranslation(key: string, language: string, value: any) {
     const { data, error } = await SupabaseService.setTranslation(key, language, value)
     return { data, error }
   }
   \`\`\`

### Phase 4: Component Updates

1. **Update Admin Components**
   - Replace all localStorage calls with Supabase service calls
   - Add loading states for async operations
   - Handle errors gracefully
   - Implement optimistic updates where appropriate

2. **Update Public Components**
   - Replace localStorage reads with Supabase queries
   - Implement caching strategies
   - Add fallback to default values

3. **Update Authentication**
   - Implement proper JWT-based authentication
   - Replace localStorage token storage with secure session management
   - Add proper logout functionality

### Phase 5: Testing and Validation

1. **Data Integrity Tests**
   - Verify all data migrated correctly
   - Test all CRUD operations
   - Validate translations work correctly

2. **Performance Tests**
   - Test query performance
   - Implement caching where needed
   - Optimize database queries

3. **Security Tests**
   - Verify RLS policies work correctly
   - Test authentication flows
   - Validate data access controls

## Migration Checklist

- [ ] Install Supabase client
- [ ] Create database schema
- [ ] Set up RLS policies
- [ ] Migrate default data
- [ ] Create service layer
- [ ] Update admin storage
- [ ] Update homepage data
- [ ] Update i18n system
- [ ] Update all components
- [ ] Test authentication
- [ ] Test all functionality
- [ ] Performance optimization
- [ ] Security validation
- [ ] Remove localStorage dependencies
- [ ] Deploy and monitor

## Rollback Plan

If issues arise during migration:
1. Keep localStorage code as backup
2. Implement feature flags to switch between storage methods
3. Maintain data synchronization between localStorage and Supabase during transition
4. Have database backup and restore procedures ready

## Post-Migration Benefits

1. **Scalability**: Database can handle much larger datasets
2. **Reliability**: Data persistence across devices and sessions
3. **Security**: Proper authentication and authorization
4. **Performance**: Optimized queries and caching
5. **Maintainability**: Centralized data management
6. **Analytics**: Better data insights and reporting capabilities

## Estimated Timeline

- **Phase 1 (Setup)**: 1-2 days
- **Phase 2 (Data Migration)**: 2-3 days
- **Phase 3 (Code Migration)**: 3-4 days
- **Phase 4 (Component Updates)**: 2-3 days
- **Phase 5 (Testing)**: 2-3 days

**Total Estimated Time**: 10-15 days

## Notes

- This migration maintains backward compatibility during transition
- All existing functionality will be preserved
- Performance should improve with proper indexing and caching
- Security will be significantly enhanced with RLS policies
- The system will be more maintainable and scalable

## Next Steps

1. Review and approve this migration plan
2. Set up Supabase project and execute SQL schema
3. Begin Phase 1 implementation
4. Test each phase thoroughly before proceeding
5. Deploy incrementally with monitoring
