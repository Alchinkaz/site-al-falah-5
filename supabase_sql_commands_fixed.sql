-- =====================================================
-- SUPABASE DATABASE SETUP FOR AL FALAH CAPITAL PARTNERS
-- =====================================================
-- Copy and paste all commands below into Supabase SQL Editor
-- Execute in order from top to bottom

-- =====================================================
-- 1. DROP EXISTING TABLES (if they exist)
-- =====================================================

DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS team_translations CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS project_translations CASCADE;
DROP TABLE IF EXISTS translations CASCADE;
DROP TABLE IF EXISTS homepage_config CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- 2. CREATE TABLES
-- =====================================================

-- Users table for authentication
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY DEFAULT '1',
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table (Portfolio Projects)
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

-- Homepage configuration table
CREATE TABLE homepage_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Translations table
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL,
  language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'ru', 'kz')),
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(key, language)
);

-- Project translations table
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

-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  photo VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team translations table
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

-- User sessions table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INDEXES
-- =====================================================

-- Projects indexes
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_homepage ON projects(show_on_homepage);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Translations indexes
CREATE INDEX idx_translations_key ON translations(key);
CREATE INDEX idx_translations_language ON translations(language);

-- Project translations indexes
CREATE INDEX idx_project_translations_project_id ON project_translations(project_id);
CREATE INDEX idx_project_translations_type ON project_translations(translation_type);

-- Team translations indexes
CREATE INDEX idx_team_translations_slug ON team_translations(team_member_slug);
CREATE INDEX idx_team_translations_type ON team_translations(translation_type);

-- User sessions indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE RLS POLICIES
-- =====================================================

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
  FOR ALL USING (true);

CREATE POLICY "Admin full access to homepage config" ON homepage_config
  FOR ALL USING (true);

CREATE POLICY "Admin full access to translations" ON translations
  FOR ALL USING (true);

CREATE POLICY "Admin full access to project translations" ON project_translations
  FOR ALL USING (true);

CREATE POLICY "Admin full access to team members" ON team_members
  FOR ALL USING (true);

CREATE POLICY "Admin full access to team translations" ON team_translations
  FOR ALL USING (true);

CREATE POLICY "Admin full access to users" ON users
  FOR ALL USING (true);

CREATE POLICY "Admin full access to user sessions" ON user_sessions
  FOR ALL USING (true);

-- =====================================================
-- 6. INSERT DEFAULT DATA
-- =====================================================

-- Insert default admin user (password: admin123)
INSERT INTO users (id, username, password_hash, role) 
VALUES ('1', 'admin', 'admin123', 'admin');

-- Insert default team members
INSERT INTO team_members (slug, photo) VALUES 
('nurlan-kussainov', '/placeholder.svg'),
('diyar-medeubekov', '/placeholder.svg'),
('altay-mamanbayev', '/placeholder.svg'),
('azhar-babayeva', '/placeholder.svg');

-- Insert default homepage configuration
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

-- Insert the 6 default projects
INSERT INTO projects (id, title, description, content, badges, investment_year, content_sections, published, show_on_homepage, created_at) VALUES
('p1', 'Alsad Kazakhstan LLP', 'Not operating and pre-bankrupt farm has been turned into the market leader in egg production reaching full capacity of 160 millions high quality eggs per year with a 20% market niche in Almaty region.', 'Not operating and pre-bankrupt farm has been turned into the market leader in egg production reaching full capacity of 160 millions high quality eggs per year with a 20% market niche in Almaty region.', '[{"label": "Agriculture", "color": "#16a34a"}, {"label": "Turnaround", "color": "#ea580c"}]', 2012, '[{"title": "Overview", "text": "Not operating and pre-bankrupt farm has been turned into the market leader in egg production reaching full capacity of 160 millions high quality eggs per year with a 20% market niche in Almaty region."}]', true, true, '2012-01-01T00:00:00Z'),
('p2', 'Karaganda Energocenter LLP', 'Investment has been used to support expansion program through the construction of new 120MW energy block to cover regional power deficit, total installed capacity has reached 712MW by the end of 2015.', 'Investment has been used to support expansion program through the construction of new 120MW energy block to cover regional power deficit, total installed capacity has reached 712MW by the end of 2015.', '[{"label": "Energy", "color": "#0ea5e9"}, {"label": "Growth", "color": "#7c3aed"}]', 2012, '[{"title": "Overview", "text": "Investment has been used to support expansion program through the construction of new 120MW energy block to cover regional power deficit, total installed capacity has reached 712MW by the end of 2015."}]', true, true, '2012-01-01T00:00:00Z'),
('p3', 'Karaganda Kus LLP', 'Further expansion of Alsad expertise to Karaganda region by attracting external funding and combined egg production business became the market leader in Kazakhstan with 300 million eggs capacity.', 'Further expansion of Alsad expertise to Karaganda region by attracting external funding and combined egg production business became the market leader in Kazakhstan with 300 million eggs capacity.', '[{"label": "Agriculture", "color": "#16a34a"}, {"label": "LBO", "color": "#dc2626"}]', 2017, '[{"title": "Overview", "text": "Further expansion of Alsad expertise to Karaganda region by attracting external funding and combined egg production business became the market leader in Kazakhstan with 300 million eggs capacity."}]', true, true, '2017-01-01T00:00:00Z'),
('p4', 'Ulmus Besshoky JSC', 'Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 1,167K tons of copper', 'Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 1,167K tons of copper', '[{"label": "Mining", "color": "#6b7280"}, {"label": "Greenfield", "color": "#059669"}]', 2015, '[{"title": "Overview", "text": "Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 1,167K tons of copper"}]', true, false, '2015-01-01T00:00:00Z'),
('p5', 'Ai Karaaul JSC', 'Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 180K tons of high grade copper', 'Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 180K tons of high grade copper', '[{"label": "Mining", "color": "#6b7280"}, {"label": "Greenfield", "color": "#059669"}]', 2008, '[{"title": "Overview", "text": "Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 180K tons of high grade copper"}]', true, false, '2008-01-01T00:00:00Z'),
('p6', 'Elefund VC funds', 'Investments were made in several consecutive VC funds that has a management team of world class operators and investors who strive for excellence and impact by building a new world of highly profitable businesses', 'Investments were made in several consecutive VC funds that has a management team of world class operators and investors who strive for excellence and impact by building a new world of highly profitable businesses', '[{"label": "Venture Capital", "color": "#2563eb"}, {"label": "Funds", "color": "#9333ea"}]', 2017, '[{"title": "Overview", "text": "Investments were made in several consecutive VC funds that has a management team of world class operators and investors who strive for excellence and impact by building a new world of highly profitable businesses"}]', true, true, '2017-01-01T00:00:00Z');

-- =====================================================
-- 7. INSERT PROJECT TRANSLATIONS
-- =====================================================

-- Project title translations
INSERT INTO project_translations (project_id, translation_type, language, value) VALUES
('p1', 'title', 'en', '"Alsad Kazakhstan LLP"'),
('p1', 'title', 'ru', '"Алсад Казахстан ТОО"'),
('p1', 'title', 'kz', '"Alsad Kazakhstan ЖШС"'),
('p2', 'title', 'en', '"Karaganda Energocenter LLP"'),
('p2', 'title', 'ru', '"Караганда Энергоцентр ТОО"'),
('p2', 'title', 'kz', '"Қарағанды Энергоцентр ЖШС"'),
('p3', 'title', 'en', '"Karaganda Kus LLP"'),
('p3', 'title', 'ru', '"Караганда Кус ТОО"'),
('p3', 'title', 'kz', '"Қарағанды Құс ЖШС"'),
('p4', 'title', 'en', '"Ulmus Besshoky JSC"'),
('p4', 'title', 'ru', '"Улмус Бешёкы АО"'),
('p4', 'title', 'kz', '"Ulmus Besshoky АҚ"'),
('p5', 'title', 'en', '"Ai Karaaul JSC"'),
('p5', 'title', 'ru', '"Ай Карааул АО"'),
('p5', 'title', 'kz', '"Ай Қарааул АҚ"'),
('p6', 'title', 'en', '"Elefund VC funds"'),
('p6', 'title', 'ru', '"Elefund венчурные фонды"'),
('p6', 'title', 'kz', '"Elefund венчур қорлары"');

-- Project badge translations
INSERT INTO project_translations (project_id, translation_type, language, value) VALUES
('p1', 'badges', 'en', '[{"en": "Agriculture", "ru": "Сельское хозяйство", "kz": "Ауыл шаруашылығы"}, {"en": "Turnaround", "ru": "Оздоровление", "kz": "Беті қайтару"}]'),
('p1', 'badges', 'ru', '[{"en": "Agriculture", "ru": "Сельское хозяйство", "kz": "Ауыл шаруашылығы"}, {"en": "Turnaround", "ru": "Оздоровление", "kz": "Беті қайтару"}]'),
('p1', 'badges', 'kz', '[{"en": "Agriculture", "ru": "Сельское хозяйство", "kz": "Ауыл шаруашылығы"}, {"en": "Turnaround", "ru": "Оздоровление", "kz": "Беті қайтару"}]'),
('p2', 'badges', 'en', '[{"en": "Energy", "ru": "Энергетика", "kz": "Энергетика"}, {"en": "Growth", "ru": "Рост", "kz": "Өсу"}]'),
('p2', 'badges', 'ru', '[{"en": "Energy", "ru": "Энергетика", "kz": "Энергетика"}, {"en": "Growth", "ru": "Рост", "kz": "Өсу"}]'),
('p2', 'badges', 'kz', '[{"en": "Energy", "ru": "Энергетика", "kz": "Энергетика"}, {"en": "Growth", "ru": "Рост", "kz": "Өсу"}]'),
('p3', 'badges', 'en', '[{"en": "Agriculture", "ru": "Сельское хозяйство", "kz": "Ауыл шаруашылығы"}, {"en": "LBO", "ru": "LBO", "kz": "LBO"}]'),
('p3', 'badges', 'ru', '[{"en": "Agriculture", "ru": "Сельское хозяйство", "kz": "Ауыл шаруашылығы"}, {"en": "LBO", "ru": "LBO", "kz": "LBO"}]'),
('p3', 'badges', 'kz', '[{"en": "Agriculture", "ru": "Сельское хозяйство", "kz": "Ауыл шаруашылығы"}, {"en": "LBO", "ru": "LBO", "kz": "LBO"}]'),
('p4', 'badges', 'en', '[{"en": "Mining", "ru": "Добыча", "kz": "Кен өндіру"}, {"en": "Greenfield", "ru": "Гринфилд", "kz": "Гринфилд"}]'),
('p4', 'badges', 'ru', '[{"en": "Mining", "ru": "Добыча", "kz": "Кен өндіру"}, {"en": "Greenfield", "ru": "Гринфилд", "kz": "Гринфилд"}]'),
('p4', 'badges', 'kz', '[{"en": "Mining", "ru": "Добыча", "kz": "Кен өндіру"}, {"en": "Greenfield", "ru": "Гринфилд", "kz": "Гринфилд"}]'),
('p5', 'badges', 'en', '[{"en": "Mining", "ru": "Добыча", "kz": "Кен өндіру"}, {"en": "Greenfield", "ru": "Гринфилд", "kz": "Гринфилд"}]'),
('p5', 'badges', 'ru', '[{"en": "Mining", "ru": "Добыча", "kz": "Кен өндіру"}, {"en": "Greenfield", "ru": "Гринфилд", "kz": "Гринфилд"}]'),
('p5', 'badges', 'kz', '[{"en": "Mining", "ru": "Добыча", "kz": "Кен өндіру"}, {"en": "Greenfield", "ru": "Гринфилд", "kz": "Гринфилд"}]'),
('p6', 'badges', 'en', '[{"en": "Venture Capital", "ru": "Венчурный капитал", "kz": "Венчурлық капитал"}, {"en": "Funds", "ru": "Фонды", "kz": "Қорлар"}]'),
('p6', 'badges', 'ru', '[{"en": "Venture Capital", "ru": "Венчурный капитал", "kz": "Венчурлық капитал"}, {"en": "Funds", "ru": "Фонды", "kz": "Қорлар"}]'),
('p6', 'badges', 'kz', '[{"en": "Venture Capital", "ru": "Венчурный капитал", "kz": "Венчурлық капитал"}, {"en": "Funds", "ru": "Фонды", "kz": "Қорлар"}]');

-- Project section translations
INSERT INTO project_translations (project_id, translation_type, language, value) VALUES
('p1', 'sections', 'en', '[{"title": "Overview", "text": "Not operating and pre-bankrupt farm has been turned into the market leader in egg production reaching full capacity of 160 millions high quality eggs per year with a 20% market niche in Almaty region."}]'),
('p1', 'sections', 'ru', '[{"title": "Обзор", "text": "Неработающая ферма на грани банкротства была превращена в лидера рынка по производству яиц с мощностью 160 млн качественных яиц в год и долей 20% в Алматинском регионе."}]'),
('p1', 'sections', 'kz', '[{"title": "Шолу", "text": "Банкроттық алдында тұрған жұмыс істемейтін ферма жылына 160 млн сапалы жұмыртқа өндіретін нарық көшбасшысына айналды, Алматы өңірінде 20% үлеске жетті."}]'),
('p2', 'sections', 'en', '[{"title": "Overview", "text": "Investment has been used to support expansion program through the construction of new 120MW energy block to cover regional power deficit, total installed capacity has reached 712MW by the end of 2015."}]'),
('p2', 'sections', 'ru', '[{"title": "Обзор", "text": "Инвестиции направлены на расширение через строительство нового энергоблока 120 МВт для покрытия дефицита мощности, установленная мощность достигла 712 МВт к концу 2015 года."}]'),
('p2', 'sections', 'kz', '[{"title": "Шолу", "text": "Инвестициялар қуат тапшылығын жабу үшін 120 МВт жаңа энергоблок салу арқылы кеңейтуге бағытталды, 2015 жылдың соңына қарай орнатылған қуат 712 МВт-қа жетті."}]'),
('p3', 'sections', 'en', '[{"title": "Overview", "text": "Further expansion of Alsad expertise to Karaganda region by attracting external funding and combined egg production business became the market leader in Kazakhstan with 300 million eggs capacity."}]'),
('p3', 'sections', 'ru', '[{"title": "Обзор", "text": "Дальнейшая экспансия экспертизы Alsad в Карагандинский регион с привлечением внешнего финансирования. Объединённый бизнес по производству яиц стал лидером рынка Казахстана с мощностью 300 млн яиц."}]'),
('p3', 'sections', 'kz', '[{"title": "Шолу", "text": "Сыртқы қаржыландыру арқылы Alsad тәжірибесін Қарағанды өңіріне кеңейту. Біріккен жұмыртқа өндірісі 300 млн жұмыртқа қуатымен Қазақстан нарығының көшбасшысы болды."}]'),
('p4', 'sections', 'en', '[{"title": "Overview", "text": "Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 1,167K tons of copper."}]'),
('p4', 'sections', 'ru', '[{"title": "Обзор", "text": "Ранняя стадия: от разведки до ТЭО с целью увеличения подтверждённых ресурсов, достигнутых на уровне 1 167 тыс. тонн меди."}]'),
('p4', 'sections', 'kz', '[{"title": "Шолу", "text": "Ерте кезең: барлау жұмыстарынан ТЭН-ге дейін, 1 167 мың тонна мыс қоры расталды."}]'),
('p5', 'sections', 'en', '[{"title": "Overview", "text": "Early stage investment to conduct initial exploration to feasibility study with aim to expand confirmed resources that has been reached to 180K tons of high grade copper."}]'),
('p5', 'sections', 'ru', '[{"title": "Обзор", "text": "Ранняя стадия: от разведки до ТЭО с целью увеличения подтверждённых ресурсов, достигнутых на уровне 180 тыс. тонн высокосортной меди."}]'),
('p5', 'sections', 'kz', '[{"title": "Шолу", "text": "Ерте кезең: барлау жұмыстарынан ТЭН-ге дейін, 180 мың тонна жоғары сапалы мыс қоры расталды."}]'),
('p6', 'sections', 'en', '[{"title": "Overview", "text": "Investments were made in several consecutive VC funds that has a management team of world class operators and investors who strive for excellence and impact by building a new world of highly profitable businesses."}]'),
('p6', 'sections', 'ru', '[{"title": "Обзор", "text": "Инвестиции в несколько последовательных венчурных фондов с командой мирового уровня, строящих высокодоходные компании с реальным воздействием."}]'),
('p6', 'sections', 'kz', '[{"title": "Шолу", "text": "Әлемдік деңгейдегі командасы бар бірнеше венчурлық қорға инвестициялар, жоғары табысты компаниялар құру арқылы әсер етеді."}]');

-- =====================================================
-- 8. INSERT DEFAULT TRANSLATIONS
-- =====================================================

-- Core translations
INSERT INTO translations (key, language, value) VALUES
('heroTitle', 'en', '"Capitalizing on Emerging Opportunities"'),
('heroTitle', 'ru', '"Используем возможности растущих рынков"'),
('heroTitle', 'kz', '"Өсіп келе жатқан мүмкіндіктерді іске асырамыз"'),
('heroButton', 'en', '"View Portfolio"'),
('heroButton', 'ru', '"Портфолио"'),
('heroButton', 'kz', '"Портфолио"'),
('portfolioTitle', 'en', '"Portfolio"'),
('portfolioTitle', 'ru', '"Портфолио"'),
('portfolioTitle', 'kz', '"Портфолио"'),
('portfolioSubtitle', 'en', '"Successful investments that helped our portfolio companies scale and grow"'),
('portfolioSubtitle', 'ru', '"Успешные инвестиции, которые помогли нашим компаниям расти и масштабироваться"'),
('portfolioSubtitle', 'kz', '"Біздің портфельдік компаниялардың өсуіне және ауқымын кеңейтуіне көмектескен инвестициялар"'),
('portfolioViewAll', 'en', '"View All"'),
('portfolioViewAll', 'ru', '"Смотреть все"'),
('portfolioViewAll', 'kz', '"Барлығын көру"'),
('aboutTitle', 'en', '"About Us"'),
('aboutTitle', 'ru', '"О компании"'),
('aboutTitle', 'kz', '"Біз туралы"'),
('stat1Subtitle', 'en', '"Assets Under Management"'),
('stat1Subtitle', 'ru', '"Активы под управлением"'),
('stat1Subtitle', 'kz', '"Басқарудағы активтер"'),
('stat2Subtitle', 'en', '"Portfolio Companies"'),
('stat2Subtitle', 'ru', '"Портфельные компании"'),
('stat2Subtitle', 'kz', '"Портфельдік компаниялар"'),
('stat3Subtitle', 'en', '"Successful Exits"'),
('stat3Subtitle', 'ru', '"Успешные выходы"'),
('stat3Subtitle', 'kz', '"Сәтті шығулар"'),
('ctaTitle', 'en', '["What future are you building?", "We''d love to connect."]'),
('ctaTitle', 'ru', '["Какое будущее вы строите?", "Будем рады познакомиться."]'),
('ctaTitle', 'kz', '["Қандай болашақ құрып жатырсыз?", "Байланысуға қуаныштымыз."]'),
('footerContactUs', 'en', '"Contact us:"'),
('footerContactUs', 'ru', '"Свяжитесь с нами:"'),
('footerContactUs', 'kz', '"Бізбен байланысыңыз:"'),
('footerNameAltay', 'en', '"Altay Mamanbayev"'),
('footerNameAltay', 'ru', '"Алтай Маманбаев"'),
('footerNameAltay', 'kz', '"Алтай Маманбаев"'),
('footerRoleAltay', 'en', '"Chief Operating Officer"'),
('footerRoleAltay', 'ru', '"Исполнительный Директор"'),
('footerRoleAltay', 'kz', '"Атқарушы Директор"'),
('footerDevelopedBy', 'en', '"Developed by Web Alchin"'),
('footerDevelopedBy', 'ru', '"Разработано Web Alchin"'),
('footerDevelopedBy', 'kz', '"Web Alchin әзірлеген"'),
('navHome', 'en', '"Home"'),
('navHome', 'ru', '"Главная"'),
('navHome', 'kz', '"Басты бет"'),
('navAbout', 'en', '"About Us"'),
('navAbout', 'ru', '"О компании"'),
('navAbout', 'kz', '"Біз туралы"'),
('navPortfolio', 'en', '"Portfolio"'),
('navPortfolio', 'ru', '"Портфолио"'),
('navPortfolio', 'kz', '"Портфолио"');

-- About page translations
INSERT INTO translations (key, language, value) VALUES
('aboutPageTitle', 'en', '"About Us"'),
('aboutPageTitle', 'ru', '"О компании"'),
('aboutPageTitle', 'kz', '"Біз туралы"'),
('aboutPageParagraphs', 'en', '["We make investments in companies across energy, mining, agriculture, food production, high‑tech, healthcare and other sectors.", "Leveraging deep regional expertise and a strong network, we are raising the Falah Growth Fund II, a USD200 million private equity fund focused on emerging opportunities and long‑term value creation.", "Al Falah Capital Partners is headquartered in Almaty. Since 2008, our principals have invested in or acquired dozens of companies including Karaganda Energocenter, Ulmus Besshoky, Alsad Kazakhstan, Ai Karaaul, Karaganda Kus, Elefund VC funds, Robinhood Inc., Soul of Nomad Inc. and others.", "Central Asia is a rapidly growing region with exceptional entrepreneurs. We remain focused on its potential and are ready to partner with new investors to capture the next wave of growth."]'),
('aboutPageParagraphs', 'ru', '["Мы инвестируем в компании из сфер энергетики, добычи, сельского хозяйства, производства продуктов питания, высоких технологий, здравоохранения и других отраслей.", "Опираясь на глубокую региональную экспертизу и сильную сеть партнёров, мы формируем Falah Growth Fund II — частный фонд объёмом 200 млн долларов США, нацеленный на новые возможности и создание долгосрочной стоимости.", "Штаб‑квартира Al Falah Capital Partners находится в Алматы. С 2008 года наши партнёры инвестировали или приобрели десятки компаний, среди которых Karaganda Energocenter, Ulmus Besshoky, Alsad Kazakhstan, Ai Karaaul, Karaganda Kus, фонды Elefund VC, Robinhood Inc., Soul of Nomad Inc. и другие.", "Центральная Азия — быстрорастущий регион с талантливыми предпринимателями. Мы сосредоточены на его потенциале и готовы вместе с новыми инвесторами использовать следующую волну роста."]'),
('aboutPageParagraphs', 'kz', '["Біз энергетика, тау‑кен өндірісі, ауыл шаруашылығы, тамақ өндірісі, жоғары технологиялар, денсаулық сақтау және басқа салалардағы компанияларға инвестиция саламыз.", "Аймақтық тәжірибеміз бен әріптестер желісіне сүйене отырып, біз құны 200 млн АҚШ долларына тең Falah Growth Fund II жеке капитал қорын құрып жатырмыз. Қордың мақсаты — жаңа мүмкіндіктерді пайдалану және ұзақ мерзімді құн қалыптастыру.", "Al Falah Capital Partners Алматыда орналасқан. 2008 жылдан бері серіктестеріміз ондаған компанияға инвестиция салып, сатып алды: Karaganda Energocenter, Ulmus Besshoky, Alsad Kazakhstan, Ai Karaaul, Karaganda Kus, Elefund VC қорлары, Robinhood Inc., Soul of Nomad Inc. және басқалары.", "Орталық Азия — жылдам дамып келе жатқан өңір. Біз осы әлеуетке сенеміз және жаңа инвесторлармен бірге келесі өсу толқынын игеруге дайынбыз."]'),
('aboutPageKeyTermsTitle', 'en', '"Key terms"'),
('aboutPageKeyTermsTitle', 'ru', '"Ключевые условия"'),
('aboutPageKeyTermsTitle', 'kz', '"Негізгі шарттар"'),
('aboutPageSectorsTitle', 'en', '"Sectors"'),
('aboutPageSectorsTitle', 'ru', '"Сектора"'),
('aboutPageSectorsTitle', 'kz', '"Салалар"'),
('teamTitle', 'en', '"Meet the team"'),
('teamTitle', 'ru', '"Команда"'),
('teamTitle', 'kz', '"Команда"');

-- Portfolio page translations
INSERT INTO translations (key, language, value) VALUES
('portfolioI18n', 'en', '{"heroTitle": "Our Portfolio", "heroSubtitle": "Discover our portfolio of innovative companies transforming industries across Central Asia", "listTitle": "Portfolio", "listSubtitle": "Successful investments that helped our portfolio companies scale and grow"}'),
('portfolioI18n', 'ru', '{"heroTitle": "Наше портфолио", "heroSubtitle": "Ознакомьтесь с портфелем инновационных компаний, меняющих отрасли в Центральной Азии", "listTitle": "Портфолио", "listSubtitle": "Успешные инвестиции, которые помогли нашим компаниям расти и масштабироваться"}'),
('portfolioI18n', 'kz', '{"heroTitle": "Біздің портфолио", "heroSubtitle": "Орталық Азиядағы салаларды өзгертетін инновациялық компаниялар портфоліосымен танысыңыз", "listTitle": "Портфолио", "listSubtitle": "Портфельдік компаниялардың өсуіне көмектескен табысты инвестициялар"}');

-- =====================================================
-- 9. INSERT TEAM TRANSLATIONS
-- =====================================================

-- Nurlan Kussainov translations
INSERT INTO team_translations (team_member_slug, translation_type, language, value) VALUES
('nurlan-kussainov', 'name', 'en', 'Nurlan Kussainov'),
('nurlan-kussainov', 'name', 'ru', 'Нурлан Кусаинов'),
('nurlan-kussainov', 'name', 'kz', 'Нұрлан Құсайынов'),
('nurlan-kussainov', 'role', 'en', 'Managing Partner'),
('nurlan-kussainov', 'role', 'ru', 'Управляющий Партнер'),
('nurlan-kussainov', 'role', 'kz', 'Басқарушы Серіктес'),
('nurlan-kussainov', 'bio_left', 'en', 'Nurlan has more than two decades of leadership across Kazakhstan''s financial sector and public institutions. His experience spans the AIFC, the National Bank of Kazakhstan, the Development Bank of Kazakhstan, the Center of Marketing and Analytical Research, CNRG Capital and the Ministry of Economic Affairs and Budget Planning.'),
('nurlan-kussainov', 'bio_left', 'ru', 'Нурлан более двадцати лет возглавлял проекты в финансовом секторе и государственных институтах Казахстана. Его опыт включает АМФЦА, Национальный банк Казахстана, Банк развития Казахстана, Центр маркетинговых и аналитических исследований, CNRG Capital и Министерство экономики и бюджетного планирования.'),
('nurlan-kussainov', 'bio_left', 'kz', 'Нұрлан Қазақстанның қаржы секторында және мемлекеттік институттарында жиырма жылдан астам жетекшілік тәжірибеге ие. Оның тәжірибесі АХҚО, Қазақстан Ұлттық Банкі, Қазақстанның Даму Банкі, Маркетинг және талдау орталығы, CNRG Capital және Экономика және бюджеттік жоспарлау министрлігін қамтиды.'),
('nurlan-kussainov', 'bio_right', 'en', 'He holds a master''s degree from the Stanford Graduate School of Business. Nurlan serves on the boards of the Astana International Exchange and Beeline Kazakhstan, and previously was Chairman of Alfa‑Bank Kazakhstan, CEO of AIFC and the Development Bank of Kazakhstan, and Deputy Governor of the Central Bank of Kazakhstan.'),
('nurlan-kussainov', 'bio_right', 'ru', 'Окончил бизнес‑школу Стэнфорда (MSM). Состоит в советах директоров Astana International Exchange и Beeline Kazakhstan. Ранее возглавлял совет директоров Альфа‑Банк Казахстан, был CEO АМФЦА и Банка развития Казахстана, а также заместителем председателя Нацбанка.'),
('nurlan-kussainov', 'bio_right', 'kz', 'Стэнфорд бизнес мектебінің магистры. Astana International Exchange және Beeline Kazakhstan директорлар кеңесінің мүшесі. Бұған дейін Альфа‑Банк Қазақстан Директорлар кеңесінің төрағасы, АХҚО мен Қазақстанның Даму Банкінің басшысы және Ұлттық Банктің төраға орынбасары болды.');

-- Diyar Medeubekov translations
INSERT INTO team_translations (team_member_slug, translation_type, language, value) VALUES
('diyar-medeubekov', 'name', 'en', 'Diyar Medeubekov'),
('diyar-medeubekov', 'name', 'ru', 'Дияр Медеубеков'),
('diyar-medeubekov', 'name', 'kz', 'Дияр Медеубеков'),
('diyar-medeubekov', 'role', 'en', 'Chief Investment Officer'),
('diyar-medeubekov', 'role', 'ru', 'Главный Директор по инвестициям'),
('diyar-medeubekov', 'role', 'kz', 'Инвестициялар жөніндегі Бас Директор'),
('diyar-medeubekov', 'bio_left', 'en', 'Diyar oversees investment strategy and has managed several of the fund''s portfolio companies. He brings operating and financial experience across mining, agriculture and financial services, and earlier served as Director of Project Finance at the Development Bank of Kazakhstan. He holds a master''s degree in Economics from Vanderbilt University.'),
('diyar-medeubekov', 'bio_left', 'ru', 'Дияр отвечает за инвестиционную стратегию и управлял портфельными компаниями фонда. Имеет операционный и финансовый опыт в горнодобывающем секторе, агро‑проме и финансах. Ранее — директор по проектному финансированию в Банке развития Казахстана. Магистр экономики Vanderbilt University.'),
('diyar-medeubekov', 'bio_left', 'kz', 'Дияр қордың инвестициялық стратегиясын қадағалайды және бірнеше портфельдік компанияларды басқарды. Тау‑кен, агро және қаржы салаларында тәжірибесі бар. Бұған дейін Қазақстанның Даму Банкі жобалық қаржыландыру директоры болды. Vanderbilt University экономика магистрі.'),
('diyar-medeubekov', 'bio_right', 'en', 'He founded and scaled technology ventures including Pulman.uz, Akshamat.kz and the AI company Fantoramma.org. He also led Alsad.kz and held roles at the Islamic Development Bank and the Development Bank of Kazakhstan.'),
('diyar-medeubekov', 'bio_right', 'ru', 'Основатель и руководитель технологических проектов Pulman.uz, Akshamat.kz и ИИ‑компании Fantoramma.org. Возглавлял Alsad.kz, занимал руководящие позиции в Исламском банке развития и Банке развития Казахстана.'),
('diyar-medeubekov', 'bio_right', 'kz', 'Pulman.uz, Akshamat.kz және Fantoramma.org сияқты технологиялық жобалардың негізін қалаған. Сондай‑ақ Alsad.kz компаниясын басқарды, Ислам даму банкі мен Қазақстанның Даму Банкі ұйымдарында қызмет етті.');

-- Altay Mamanbayev translations
INSERT INTO team_translations (team_member_slug, translation_type, language, value) VALUES
('altay-mamanbayev', 'name', 'en', 'Altay Mamanbayev'),
('altay-mamanbayev', 'name', 'ru', 'Алтай Маманбаев'),
('altay-mamanbayev', 'name', 'kz', 'Алтай Маманбаев'),
('altay-mamanbayev', 'role', 'en', 'Chief Operating Officer'),
('altay-mamanbayev', 'role', 'ru', 'Исполнительный Директор'),
('altay-mamanbayev', 'role', 'kz', 'Атқарушы Директор'),
('altay-mamanbayev', 'bio_left', 'en', 'Altay has led the fund''s operations since 2008. Before joining Al Falah, he worked as a financial consultant at Eurasia Financial Management Consulting and held managerial roles at Panalpina World Transport LLP in Kazakhstan.'),
('altay-mamanbayev', 'bio_left', 'ru', 'Алтай руководит операционной деятельностью фонда с 2008 года. До этого работал финансовым консультантом в Eurasia Financial Management Consulting и занимал руководящие позиции в Panalpina World Transport LLP в Казахстане.'),
('altay-mamanbayev', 'bio_left', 'kz', 'Алтай 2008 жылдан бері қордың операциялық қызметін басқарады. Бұған дейін Eurasia Financial Management Consulting компаниясында қаржылық кеңесші болып, Қазақстандағы Panalpina World Transport LLP компаниясында басшылық лауазымдарда болды.'),
('altay-mamanbayev', 'bio_right', 'en', 'A fellow of the ACCA and certified auditor, Altay has over twenty years in finance covering governance, taxation, budgeting, audit, reporting and compliance. He has held leadership roles at Al Falah Group and Panalpina.'),
('altay-mamanbayev', 'bio_right', 'ru', 'Член ACCA и сертифицированный аудитор, Алтай имеет более 20 лет опыта в финансах: корпоративное управление, налогообложение, бюджетирование, аудит, отчётность и комплаенс. Занимал руководящие должности в Al Falah Group и Panalpina.'),
('altay-mamanbayev', 'bio_right', 'kz', 'ACCA мүшесі және сертификатталған аудитор. Қаржыда 20 жылдан астам тәжірибе: корпоративтік басқару, салық, бюджеттеу, аудит, есептілік және комплаенс. Al Falah Group және Panalpina компанияларында жетекшілік етті.');

-- Azhar Babayeva translations
INSERT INTO team_translations (team_member_slug, translation_type, language, value) VALUES
('azhar-babayeva', 'name', 'en', 'Azhar Babayeva'),
('azhar-babayeva', 'name', 'ru', 'Ажар Бабаева'),
('azhar-babayeva', 'name', 'kz', 'Ажар Бабаева'),
('azhar-babayeva', 'role', 'en', 'Reporting Manager'),
('azhar-babayeva', 'role', 'ru', 'Менеджер по отчетности и процессам'),
('azhar-babayeva', 'role', 'kz', 'Есеп беру және процесс менеджері'),
('azhar-babayeva', 'bio_left', 'en', 'Azhar joined Al Falah in 2013 and today oversees financial reporting and compliance. She has more than fifteen years of experience across finance, audit, tax, budgeting and fund administration, and began her career as an auditor at EY Kazakhstan.'),
('azhar-babayeva', 'bio_left', 'ru', 'Азхар пришла в Al Falah в 2013 году и сегодня отвечает за финансовую отчётность и комплаенс. Имеет более 15 лет опыта в финансах, аудите, налогах, бюджетировании и администрировании фондов; карьеру начинала аудитором в EY Казахстан.'),
('azhar-babayeva', 'bio_left', 'kz', 'Азхар 2013 жылы Al Falah компаниясына келді және қазір қаржылық есеп пен комплаенсті қадағалайды. Қаржы, аудит, салық, бюджеттеу және қор әкімшілігі бойынша 15 жылдан астам тәжірибесі бар; мансабын EY Kazakhstan компаниясында аудитор ретінде бастаған.'),
('azhar-babayeva', 'bio_right', 'en', 'Azhar earned bachelor''s and master''s degrees from KIMEP University and is currently pursuing the ACCA professional qualification.'),
('azhar-babayeva', 'bio_right', 'ru', 'Окончила бакалавриат и магистратуру KIMEP University, в настоящее время проходит профессиональную сертификацию ACCA.'),
('azhar-babayeva', 'bio_right', 'kz', 'KIMEP University бакалавриаты мен магистратурасын бітірген, қазір ACCA кәсіби біліктілігін алып жатыр.');

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- All database setup is now complete!
-- You can now proceed with the code migration phase.
-- The database contains:
-- - 8 tables with proper relationships
-- - All indexes for performance
-- - Row Level Security policies
-- - Default admin user (username: admin, password: admin123)
-- - 6 default portfolio projects with full translations
-- - All default translations for the website
-- - Team member data with translations
-- - Homepage configuration
