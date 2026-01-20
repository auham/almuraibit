-- =====================================================
-- Supabase Database Setup for Al-Murabait Wedding App
-- Run this SQL in the Supabase SQL Editor
-- =====================================================

-- جدول الدعوات (Invitations Table)
CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  groom_name TEXT NOT NULL,
  groom_father TEXT,
  wedding_date DATE NOT NULL,
  wedding_time TEXT,
  location_name TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول الأخبار (News Table)
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on tables
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بالقراءة (Allow everyone to read)
CREATE POLICY "Public can read invitations" ON invitations
  FOR SELECT USING (true);

CREATE POLICY "Public can read news" ON news
  FOR SELECT USING (true);

-- السماح للمسؤولين فقط بالإضافة والتعديل والحذف
-- (Only authenticated users can insert, update, delete)
CREATE POLICY "Authenticated users can insert invitations" ON invitations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update invitations" ON invitations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete invitations" ON invitations
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert news" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update news" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete news" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- إضافة بيانات تجريبية (Optional Sample Data)
-- =====================================================

-- يمكنك حذف هذا الجزء إذا لم ترد بيانات تجريبية

INSERT INTO invitations (groom_name, groom_father, wedding_date, wedding_time, location_name, description)
VALUES (
  'محمد أحمد المريبيط',
  'أحمد عبدالله المريبيط',
  CURRENT_DATE + INTERVAL '7 days',
  '20:00',
  'قاعة الفرح - الرياض',
  'يسرنا دعوتكم لحضور حفل زفاف ابننا. نتشرف بحضوركم.'
);

INSERT INTO news (title, content)
VALUES (
  'مرحباً بكم في تطبيق عائلة المريبيط',
  'هذا التطبيق مخصص لمشاركة دعوات الزواج وأخبار العائلة. نتمنى لكم تجربة ممتعة.'
);
