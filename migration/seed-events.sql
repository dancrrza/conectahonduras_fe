-- SEED: 50 demo events
-- Run order: rollback.sql → migration.sql → this file

DO $$
DECLARE
org_id uuid := 'c2b0004c-783a-4477-839f-97ffd583b069';
BEGIN

INSERT INTO public.profiles (id, full_name, username, user_type, application_status, organizer_name, city, reviewed_at)
VALUES (
           org_id, 'Demo Organizer', 'demo_organizer',
           'organizer', 'approved', 'Demo Organizer', 'Ramallah', now()
       )
    ON CONFLICT (id) DO UPDATE SET
    user_type          = 'organizer',
                            application_status = 'approved',
                            reviewed_at        = now();

DELETE FROM public.events WHERE organizer_id = org_id;

INSERT INTO public.events
(organizer_id, title, description, city, category, event_type,
 start_date, end_date, price, capacity, external_link, images, status, is_featured, slug)
VALUES

-- ════════════════════════════════════
-- MUSIC (8)
-- ════════════════════════════════════

(org_id, 'Sundown Sessions – Open Air DJ Night',
 'An evening of deep house and afro beats on the rooftop of Teatro Cultural. Featuring resident DJs and a surprise international guest. Expect an unforgettable night under the stars with stunning city views and a carefully curated sound journey from dusk to dawn.',
 'Ramallah', 'Music', 'Event',
 now() + interval '5 days 20:00:00', now() + interval '6 days 02:00:00',
 35, 200, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80'],
 'approved', true, 'sundown-sessions-open-air-dj-night'),

(org_id, 'Rooftop Jazz Night',
 'An intimate jazz evening on the rooftop of Snowbar featuring a live quartet. The set blends jazz standards with original compositions inspired by Palestinian maqam scales. Bar open from 7pm. Show starts at 9pm.',
 'Ramallah', 'Music', 'Event',
 now() + interval '12 days 21:00:00', now() + interval '13 days 00:00:00',
 25, 60, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80'],
 'approved', true, 'rooftop-jazz-night'),

(org_id, 'Oud & Violin Duo – Live Concert',
 'A magical evening of classical Arabic music featuring the virtuoso duo of oud master Samir Joubran and violinist Maya Khalil. The program includes traditional maqam improvisation and original compositions premiering for the first time.',
 'Jerusalem', 'Music', 'Event',
 now() + interval '8 days 20:00:00', now() + interval '8 days 22:30:00',
 40, 150, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80'],
 'approved', false, 'oud-violin-duo-live-concert'),

(org_id, 'Electronic Music Festival',
 'Three stages, 20 artists, one unforgettable day. Palestine''s biggest electronic music festival returns with local and international acts spanning techno, house, and ambient. Gates open at 2pm. Camping available.',
 'Ramallah', 'Music', 'Event',
 now() + interval '30 days 14:00:00', now() + interval '31 days 04:00:00',
 65, 500, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80',
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'],
 'approved', true, 'electronic-music-festival'),

(org_id, 'Fairuz Tribute Night',
 'A full orchestra performs the legendary repertoire of Fairuz, the voice of Lebanon and the Arab world. Conducted by maestro Ramzi Abou Khalil. A night of nostalgia, emotion, and shared memory.',
 'Bethlehem', 'Music', 'Event',
 now() + interval '22 days 20:30:00', now() + interval '22 days 23:00:00',
 30, 300, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80'],
 'approved', false, 'fairuz-tribute-night'),

(org_id, 'Hip Hop Cypher Night',
 'Monthly open freestyle session for rappers and beatboxers. Hosted by MC Bilal. All levels welcome. Beat producer showcase in the second half. No registration needed.',
 'Nablus', 'Music', 'Event',
 now() + interval '7 days 21:00:00', now() + interval '8 days 00:00:00',
 10, 80, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1501386761578-eaa54b8598e8?w=800&q=80'],
 'approved', false, 'hip-hop-cypher-night'),

(org_id, 'Acoustic Sessions at Al-Kasaba',
 'An intimate evening of acoustic performances by four emerging Palestinian singer-songwriters. Each artist performs a 20-minute set of originals. Doors open at 7pm. Limited seats — arrive early.',
 'Ramallah', 'Music', 'Event',
 now() + interval '4 days 19:30:00', now() + interval '4 days 22:30:00',
 15, 40, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80'],
 'approved', false, 'acoustic-sessions-al-kasaba'),

(org_id, 'Music Production Masterclass',
 'A full-day workshop with award-winning producer Kareem Masso covering DAW workflows, sampling Arabic music legally, mixing for streaming platforms, and building your brand as an independent artist. Laptop required.',
 'Ramallah', 'Music', 'Experience',
 now() + interval '17 days 10:00:00', now() + interval '17 days 18:00:00',
 80, 20, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80'],
 'approved', false, 'music-production-masterclass'),

-- ════════════════════════════════════
-- FOOD & DRINK (7)
-- ════════════════════════════════════

(org_id, 'Old City Food Walk',
 'Explore the flavors of the old city with a guided food tour through the ancient market. Taste 10+ traditional dishes and learn their stories from local chefs and vendors who have been perfecting their craft for generations.',
 'Jerusalem', 'Food & Drink', 'Experience',
 now() + interval '3 days 10:00:00', now() + interval '3 days 13:00:00',
 50, 20, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'],
 'approved', true, 'old-city-food-walk'),

(org_id, 'Organic Farmers Market',
 'Monthly market bringing together 30+ local farmers, producers, and artisans. Find seasonal vegetables, olive oil, za''atar blends, handmade soaps, and more. Free entry. Family and pet friendly.',
 'Bethlehem', 'Food & Drink', 'Event',
 now() + interval '14 days 08:00:00', now() + interval '14 days 14:00:00',
 null, null, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80'],
 'approved', false, 'organic-farmers-market'),

(org_id, 'Palestinian Cuisine Cooking Class',
 'Chef Rania Abu Ali teaches you the secrets of classic Palestinian dishes: musakhan, maqluba, and knafeh from scratch. All ingredients provided. You cook, you eat, you take the recipes home. Small groups of 8 maximum.',
 'Nablus', 'Food & Drink', 'Experience',
 now() + interval '6 days 11:00:00', now() + interval '6 days 15:00:00',
 60, 8, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80'],
 'approved', true, 'palestinian-cuisine-cooking-class'),

(org_id, 'Wine & Olive Oil Tasting',
 'Discover the wines and olive oils of Palestinian producers in this guided tasting session hosted at Cremisan Valley. Learn to identify varietals, pressing methods, and regional terroir. Cheese and sourdough provided.',
 'Bethlehem', 'Food & Drink', 'Experience',
 now() + interval '11 days 17:00:00', now() + interval '11 days 20:00:00',
 45, 24, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80'],
 'approved', false, 'wine-olive-oil-tasting'),

(org_id, 'Street Food Festival – Ramallah',
 'Two days of street food from 40+ vendors spanning Palestinian, Lebanese, Turkish, and fusion cuisines. Live cooking demonstrations every hour. Kids'' corner, live music, and a knafeh competition.',
 'Ramallah', 'Food & Drink', 'Event',
 now() + interval '25 days 12:00:00', now() + interval '26 days 22:00:00',
 null, null, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&q=80',
 'https://images.unsplash.com/photo-1530062845289-9109b2c9c868?w=800&q=80'],
 'approved', false, 'street-food-festival-ramallah'),

(org_id, 'Fermentation & Preserves Workshop',
 'Learn the Palestinian art of pickling, fermenting, and preserving with Um Hassan. We make makdous, pickled turnips, and fermented kishk. All materials provided. Take home jars of your own creations.',
 'Hebron', 'Food & Drink', 'Experience',
 now() + interval '9 days 09:00:00', now() + interval '9 days 12:00:00',
 35, 10, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=800&q=80'],
 'approved', false, 'fermentation-preserves-workshop'),

(org_id, 'Coffee Cupping – Palestinian Specialty Roasters',
 'Sit with three of Palestine''s specialty coffee roasters and taste your way through 12 single-origin coffees. Learn cupping protocol, flavor profiling, and the story behind each bean. Take home 250g of your favorite.',
 'Ramallah', 'Food & Drink', 'Experience',
 now() + interval '16 days 10:00:00', now() + interval '16 days 12:30:00',
 30, 14, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'],
 'approved', false, 'coffee-cupping-specialty-roasters'),

-- ════════════════════════════════════
-- ART (7)
-- ════════════════════════════════════

(org_id, 'Palestine Art Collective – Group Exhibition',
 'A showcase of emerging Palestinian artists working across painting, sculpture, and mixed media. Opening night includes a live performance, artist talks, and a reception. Exhibition runs 10 days — free entry throughout.',
 'Ramallah', 'Art', 'Event',
 now() + interval '7 days 18:00:00', now() + interval '17 days 20:00:00',
 null, null, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80'],
 'approved', false, 'palestine-art-collective-group-exhibition'),

(org_id, 'Arabic Calligraphy Workshop',
 'Learn the art of Arabic calligraphy with master calligrapher Rami Suleiman. We cover the Naskh and Thuluth scripts over a 3-hour session. All tools and paper provided. Take home your finished piece.',
 'Jerusalem', 'Art', 'Experience',
 now() + interval '11 days 10:00:00', now() + interval '11 days 13:00:00',
 40, 16, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80'],
 'approved', false, 'arabic-calligraphy-workshop'),

(org_id, 'Pottery & Clay Morning',
 'A hands-on morning workshop for beginners and intermediate potters in the historic Hebron tradition. All materials included. Walk away with your own handmade piece, glazed and fired, delivered within 2 weeks.',
 'Hebron', 'Art', 'Experience',
 now() + interval '4 days 09:00:00', now() + interval '4 days 12:00:00',
 45, 12, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80'],
 'approved', false, 'pottery-clay-morning'),

(org_id, 'Photography Walk – Nablus Old City',
 'A guided photography walk through the winding streets of Nablus old city with photographer Lara Haddad. We explore light, composition, and street photography ethics. Bring any camera — phone cameras welcome.',
 'Nablus', 'Art', 'Experience',
 now() + interval '13 days 07:00:00', now() + interval '13 days 10:00:00',
 25, 12, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80'],
 'approved', false, 'photography-walk-nablus-old-city'),

(org_id, 'Street Art Tour – Bethlehem Murals',
 'A walking tour of Bethlehem''s iconic street art with local guide and artist Yousef Anastas. From Banksy''s works to local muralists, discover the stories painted on the wall. Tour ends with a hands-on stencil workshop.',
 'Bethlehem', 'Art', 'Experience',
 now() + interval '5 days 10:00:00', now() + interval '5 days 13:00:00',
 20, 15, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&q=80'],
 'approved', true, 'street-art-tour-bethlehem-murals'),

(org_id, 'Watercolor Painting Class – Landscapes',
 'A relaxed Sunday morning painting session with instructor Nadia Mansour. We paint Palestinian landscapes in watercolor — olive groves, old city rooftops, and desert light. All materials provided. No experience needed.',
 'Ramallah', 'Art', 'Experience',
 now() + interval '18 days 09:30:00', now() + interval '18 days 12:30:00',
 35, 10, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80'],
 'approved', false, 'watercolor-painting-class-landscapes'),

(org_id, 'Traditional Embroidery Class',
 'Learn tatreez — the ancient Palestinian embroidery tradition — with master embroiderer Um Khalil. We cover the cross-stitch patterns of three different regions. Materials included. Take home a finished bookmark.',
 'Hebron', 'Culture', 'Experience',
 now() + interval '21 days 10:00:00', now() + interval '21 days 13:00:00',
 35, 10, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80'],
 'approved', false, 'traditional-embroidery-class'),

-- ════════════════════════════════════
-- BUSINESS & TECH (6)
-- ════════════════════════════════════

(org_id, 'Startup Founders Meetup #12',
 'Monthly gathering for founders, builders, and investors in the Palestinian tech ecosystem. 3-minute pitches, open networking, and free coffee. Every month we invite a guest speaker who has built something remarkable.',
 'Ramallah', 'Business', 'Event',
 now() + interval '6 days 19:00:00', now() + interval '6 days 22:00:00',
 null, 80, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80'],
 'approved', false, 'startup-founders-meetup-12'),

(org_id, 'Women in Tech Panel – Future Builders',
 'A panel discussion featuring five Palestinian women who are building companies, leading engineering teams, and reshaping the tech landscape. Open Q&A follows. Networking reception from 7–8pm.',
 'Ramallah', 'Business', 'Event',
 now() + interval '15 days 18:00:00', now() + interval '15 days 20:00:00',
 null, 100, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'],
 'approved', false, 'women-in-tech-panel-future-builders'),

(org_id, 'Hackathon: Build for Palestine',
 '48-hour hackathon challenging developers, designers, and product thinkers to build solutions for local challenges in agriculture, education, and healthcare. Teams of 2–5. Cash prizes for top 3 teams.',
 'Ramallah', 'Education', 'Event',
 now() + interval '20 days 09:00:00', now() + interval '22 days 18:00:00',
 null, 120, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80'],
 'approved', true, 'hackathon-build-for-palestine'),

(org_id, 'Product Design Workshop – UX for Impact',
 'A full-day intensive led by product designer Tala Nassar on designing digital products for under-served communities. Covers research methods, rapid prototyping, and accessibility. Figma required. Intermediate level.',
 'Ramallah', 'Education', 'Experience',
 now() + interval '23 days 09:00:00', now() + interval '23 days 17:00:00',
 70, 20, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80'],
 'approved', false, 'product-design-workshop-ux-impact'),

(org_id, 'AI & the Future of Work – Panel',
 'Three technologists and one economist discuss how artificial intelligence is reshaping employment in the MENA region. What jobs survive, what emerges, and how to prepare. Moderated with live audience Q&A.',
 'Ramallah', 'Business', 'Event',
 now() + interval '19 days 18:30:00', now() + interval '19 days 21:00:00',
 null, 150, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80'],
 'approved', false, 'ai-future-of-work-panel'),

(org_id, 'Freelancing Masterclass – Build Your Client Base',
 'Practical session for designers, developers, and writers on finding international clients, setting rates, writing contracts, and managing remote work. Taught by a Palestinian freelancer earning internationally for 7+ years.',
 'Nablus', 'Business', 'Experience',
 now() + interval '14 days 17:00:00', now() + interval '14 days 21:00:00',
 25, 40, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80'],
 'approved', false, 'freelancing-masterclass-build-client-base'),

-- ════════════════════════════════════
-- SPORTS & OUTDOORS (7)
-- ════════════════════════════════════

(org_id, 'Trail Run – Battir Terraces',
 'A 12km trail run through the UNESCO-listed terraces of Battir. All paces welcome — this is a social run, not a race. We finish with a communal breakfast prepared by local families. Running shoes and water required.',
 'Bethlehem', 'Sports', 'Event',
 now() + interval '10 days 06:30:00', now() + interval '10 days 10:00:00',
 15, 60, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1551958219-acbc560f5c63?w=800&q=80'],
 'approved', false, 'trail-run-battir-terraces'),

(org_id, 'Beach Volleyball Tournament',
 'Annual 3v3 beach volleyball tournament open to all skill levels. Prizes for top 3 teams. Registration covers the full day including lunch and refreshments. Register solo and we''ll place you in a team.',
 'Bethlehem', 'Sports', 'Event',
 now() + interval '25 days 09:00:00', now() + interval '25 days 18:00:00',
 20, 80, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80'],
 'approved', false, 'beach-volleyball-tournament'),

(org_id, 'Sunrise Hike – Mount Gerizim',
 'A guided 3-hour sunrise hike to the summit of Mount Gerizim above Nablus with local guide Hasan Qasim. The view at sunrise is extraordinary. Moderate difficulty. Water and headlamp required. Departs 4:30am.',
 'Nablus', 'Sports', 'Experience',
 now() + interval '9 days 04:30:00', now() + interval '9 days 08:00:00',
 20, 16, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'],
 'approved', false, 'sunrise-hike-mount-gerizim'),

(org_id, 'Yoga Retreat – Jericho Palm Groves',
 'A weekend yoga retreat in the palm groves outside Jericho. Two days of morning and evening yoga sessions, guided meditation, and sound healing. Accommodation and all meals included. All levels welcome.',
 'Jericho', 'Sports', 'Experience',
 now() + interval '28 days 15:00:00', now() + interval '30 days 12:00:00',
 180, 16, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'],
 'approved', true, 'yoga-retreat-jericho-palm-groves'),

(org_id, 'Rock Climbing Day – Wadi Qelt',
 'An introduction to outdoor rock climbing in the dramatic canyon of Wadi Qelt. Certified instructors provide all gear and safety briefing. No experience needed. Suitable for ages 14+. Transport from Jerusalem included.',
 'Jericho', 'Sports', 'Experience',
 now() + interval '15 days 07:00:00', now() + interval '15 days 14:00:00',
 55, 12, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80'],
 'approved', false, 'rock-climbing-day-wadi-qelt'),

(org_id, 'Cycling Tour – Jerusalem to Bethlehem',
 'A 25km guided cycling tour from Jerusalem to Bethlehem on a mix of road and gravel paths. Stops at historical sites, an olive grove, and a family farm for lunch. Bikes and helmets provided. Intermediate fitness required.',
 'Jerusalem', 'Sports', 'Experience',
 now() + interval '12 days 07:30:00', now() + interval '12 days 14:00:00',
 45, 14, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80'],
 'approved', false, 'cycling-tour-jerusalem-bethlehem'),

(org_id, 'Dead Sea Float & Wellness Day',
 'A full-day wellness experience at the Dead Sea. Includes a guided float session, mud treatment, light yoga on the shore, and a healthy lunch at a local guesthouse. Transport from Ramallah included.',
 'Jericho', 'Sports', 'Experience',
 now() + interval '20 days 07:00:00', now() + interval '20 days 18:00:00',
 75, 20, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'],
 'approved', false, 'dead-sea-float-wellness-day'),

-- ════════════════════════════════════
-- CULTURE & EDUCATION (7)
-- ════════════════════════════════════

(org_id, 'Open Mic Night – Stories & Spoken Word',
 'An open mic night celebrating Arabic and English spoken word, poetry, and personal storytelling. Sign up on the door for a 5-minute slot, or just come to listen. Cozy venue, warm crowd, no judgment.',
 'Ramallah', 'Culture', 'Event',
 now() + interval '18 days 20:00:00', now() + interval '18 days 23:00:00',
 10, 50, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80'],
 'approved', false, 'open-mic-night-stories-spoken-word'),

(org_id, 'Dabke Workshop – Traditional & Fusion',
 'Learn the roots of dabke from master instructor Khaled Awad, followed by a fusion session blending traditional and contemporary movement. Suitable for all levels. No experience needed — just enthusiasm.',
 'Nablus', 'Culture', 'Experience',
 now() + interval '8 days 17:00:00', now() + interval '8 days 20:00:00',
 20, 30, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80'],
 'approved', false, 'dabke-workshop-traditional-fusion'),

(org_id, 'Olive Harvest Experience',
 'Join a local farming family for a day of olive picking in their ancient grove near Nablus. Learn traditional harvesting methods, press your own oil, and share a traditional lunch. Transport from Ramallah included.',
 'Nablus', 'Culture', 'Experience',
 now() + interval '16 days 07:30:00', now() + interval '16 days 17:00:00',
 55, 20, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80'],
 'approved', true, 'olive-harvest-experience'),

(org_id, 'Storytelling for Kids – Folklore Edition',
 'A weekend morning of interactive storytelling for children aged 4–10, featuring Palestinian folk tales brought to life with puppets, music, and audience participation. Conducted in Arabic and English.',
 'Ramallah', 'Education', 'Event',
 now() + interval '11 days 10:00:00', now() + interval '11 days 12:00:00',
 null, 50, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1503676382389-4809596d5290?w=800&q=80'],
 'approved', false, 'storytelling-kids-folklore-edition'),

(org_id, 'Heritage Walk – Sebastia Archaeological Site',
 'A guided walk through the ancient ruins of Sebastia with archaeologist Dr. Rania Barakat. The site spans Canaanite, Israelite, Hellenistic, and Roman periods. Transport from Nablus center included.',
 'Nablus', 'Culture', 'Experience',
 now() + interval '24 days 09:00:00', now() + interval '24 days 13:00:00',
 25, 18, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'],
 'approved', false, 'heritage-walk-sebastia'),

(org_id, 'Sound Healing & Meditation Evening',
 'A deep relaxation session using Tibetan singing bowls, oud, and guided breath work. Hosted in a private garden. Limited to 15 participants to maintain an intimate atmosphere. Mats and cushions provided.',
 'Ramallah', 'Health', 'Experience',
 now() + interval '2 days 19:30:00', now() + interval '2 days 21:00:00',
 30, 15, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80'],
 'approved', false, 'sound-healing-meditation-evening'),

(org_id, 'Arabic Language Immersion Weekend',
 'A weekend immersion for intermediate Arabic learners wanting to improve conversational fluency. Structured sessions in the morning, conversation exchanges with locals in the afternoon.',
 'Ramallah', 'Education', 'Experience',
 now() + interval '33 days 09:00:00', now() + interval '34 days 17:00:00',
 90, 12, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'],
 'approved', false, 'arabic-language-immersion-weekend'),

-- ════════════════════════════════════
-- ENTERTAINMENT (8)
-- ════════════════════════════════════

(org_id, 'Cinema Under the Stars',
 'Outdoor screening of classic Palestinian and Arab cinema in the courtyard of the Cultural Palace. Bring a blanket and enjoy the film under the night sky. Popcorn and warm drinks provided.',
 'Ramallah', 'Entertainment', 'Event',
 now() + interval '9 days 21:00:00', now() + interval '9 days 23:30:00',
 null, null, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'],
 'approved', true, 'cinema-under-the-stars'),

(org_id, 'Comedy Night – Stand Up in Arabic',
 'Four Palestinian stand-up comedians perform back-to-back sets covering everything from family life to politics. Hosted by comedian Majd Kayyal. 18+. Bar open from 8pm. Show at 9pm sharp.',
 'Ramallah', 'Entertainment', 'Event',
 now() + interval '13 days 21:00:00', now() + interval '13 days 23:30:00',
 20, 80, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80'],
 'approved', false, 'comedy-night-stand-up-arabic'),

(org_id, 'Escape Room – The Labyrinth of Al-Quds',
 'A fully immersive escape room experience set in the old city of Jerusalem. Solve puzzles, decode ancient maps, and unravel a mystery in 60 minutes. Teams of 2–6 players. Ages 12+.',
 'Jerusalem', 'Entertainment', 'Experience',
 now() + interval '1 days 10:00:00', now() + interval '40 days 22:00:00',
 18, 6, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80'],
 'approved', false, 'escape-room-labyrinth-al-quds'),

(org_id, 'Theatre Production – Letters from Home',
 'A new play by playwright Samah Selim exploring the Palestinian experience through the letters of three generations. Performed in Arabic with English surtitles. Five performances only.',
 'Ramallah', 'Entertainment', 'Event',
 now() + interval '26 days 20:00:00', now() + interval '30 days 22:30:00',
 22, 120, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&q=80'],
 'approved', false, 'theatre-production-letters-from-home'),

(org_id, 'Game Night – Board Games & Strategy',
 'Monthly gathering for board game enthusiasts. We set up 10+ games simultaneously — from Catan to complex strategy games. Coaches available for newcomers. Snacks and drinks provided. Drop in between 5–11pm.',
 'Ramallah', 'Entertainment', 'Event',
 now() + interval '7 days 17:00:00', now() + interval '7 days 23:00:00',
 5, 60, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80'],
 'approved', false, 'game-night-board-games-strategy'),

(org_id, 'Stargazing Night – Desert of Judea',
 'A guided stargazing experience in the Judean Desert with astronomer Faris Nassar. Learn to identify constellations and planets through professional telescopes. Hot tea provided. Transport from Jerusalem.',
 'Jericho', 'Entertainment', 'Experience',
 now() + interval '17 days 20:00:00', now() + interval '18 days 00:00:00',
 40, 15, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80'],
 'approved', false, 'stargazing-night-desert-judea'),

(org_id, 'Film Screening – Palestinian New Wave',
 'A curated screening of three short films by Palestinian directors exploring identity, displacement, and return. Q&A with directors follows each film. In Arabic with English subtitles. Free entry.',
 'Ramallah', 'Entertainment', 'Event',
 now() + interval '10 days 19:00:00', now() + interval '10 days 22:30:00',
 null, 80, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80'],
 'approved', false, 'film-screening-palestinian-new-wave'),

(org_id, 'Trivia Night – History & Culture Edition',
 'A lively pub-style trivia night focused on Palestinian, Arab, and world history. Teams of 2–6. Winner takes the pot. Hosted every second Thursday. Register your team name at the door.',
 'Ramallah', 'Entertainment', 'Event',
 now() + interval '14 days 20:00:00', now() + interval '14 days 23:00:00',
 8, 80, 'https://tickets.example.com',
 ARRAY['https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80'],
 'approved', false, 'trivia-night-history-culture');

END $$;