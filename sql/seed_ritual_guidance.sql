-- Seed ritual guidance sections for initial setup
INSERT INTO public.ritual_guidance_sections (id, slug, title, section_group, body, sort_order, is_published, created_at, updated_at)
VALUES
  -- General
  ('8c98c1f4-c1a1-4a1c-a1c1-a1c1a1c1a1c1'::uuid, 'how-to-use-guide', 'How to Use This Guide', 'general', E'This manual gives a simple, step-by-step ritual overview for Hajj and Umrah.\nPlease follow your group leader and consult a qualified scholar for any personal rulings.\n- Keep your passport, visa, and ID copies with you at all times\n- Stay hydrated and rest frequently\n- Follow your group schedule and meeting points\n- Be patient in crowds and protect the elderly', 1, true, now(), now()),

  -- Before Departure
  ('8c98c2f4-c2a1-4a2c-a2c1-a2c1a2c1a2c1'::uuid, 'before-departure', 'Before Departure Checklist', 'before_departure', E'- Confirm passport validity, visa, and booking documents\n- Vaccinations completed (as required by authorities)\n- Pack Ihram, slippers, light clothing, and basic medicines\n- Learn basic rites and memorize key duas\n- Keep photocopies of documents and emergency contacts\n- Practice Ihram and Talbiyah before travel', 2, true, now(), now()),

  -- Umrah
  ('8c98c3f4-c3a1-4a3c-a3c1-a3c1a3c1a3c1'::uuid, 'umrah-step-by-step', 'Umrah Step-by-Step', 'umrah', E'- Enter Ihram at Miqat, make intention (niyyah), and begin Talbiyah\n- Enter Masjid al-Haram with right foot, make dua\n- Perform Tawaf: 7 circuits, Kaaba on left, begin at Black Stone\n- Pray 2 rakah behind Maqam Ibrahim if possible\n- Drink Zamzam and make dua\n- Perform Sai between Safa and Marwah (7 trips)\n- Men shave or trim hair; women trim a small portion', 3, true, now(), now()),

  -- Madinah
  ('8c98c4f4-c4a1-4a4c-a4c1-a4c1a4c1a4c1'::uuid, 'at-madinah', 'At Madinah', 'madinah', E'- Offer salah in Masjid an-Nabawi regularly\n- If possible, visit Rawdah during allocated times\n- Visit Masjid Quba and pray 2 rakah\n- Visit Uhud and remember the sacrifices of the Sahabah\n- Visit Jannat al-Baqi (men only, if open)', 4, true, now(), now()),

  -- Makkah
  ('8c98c5f4-c5a1-4a5c-a5c1-a5c1a5c1a5c1'::uuid, 'at-makkah', 'At Makkah', 'makkah', E'- Maintain wudu and keep your group contact details\n- Observe crowd safety during Tawaf and Sai\n- Use the designated entry/exit paths\n- Avoid pushing; focus on calm dhikr', 5, true, now(), now()),

  -- Hajj
  ('8c98c6f4-c6a1-4a6c-a6c1-a6c1a6c1a6c1'::uuid, 'hajj-step-by-step', 'Hajj Step-by-Step (Summary)', 'hajj', E'- 8th Dhul Hijjah: Enter Ihram for Hajj and go to Mina\n- 9th Dhul Hijjah: Stand at Arafat until Maghrib, then go to Muzdalifah\n- 10th Dhul Hijjah: Rami Jamrah Aqabah, sacrifice, shave/trim, Tawaf Ifadah and Sai\n- 11th-13th Dhul Hijjah: Rami all three Jamarat each day\n- Final Tawaf (Tawaf al-Wada) before leaving Makkah', 6, true, now(), now()),

  -- Hajj Days
  ('8c98c7f4-c7a1-4a7c-a7c1-a7c1a7c1a7c1'::uuid, 'during-hajj-days', 'During Hajj Days', 'hajj_days', E'- Mina: stay in your camp, follow the schedule\n- Arafat: this is the most important day; focus on dua and repentance\n- Muzdalifah: collect pebbles, rest, and pray Fajr\n- Jamarat: throw pebbles calmly with your group', 7, true, now(), now()),

  -- Ihram
  ('8c98c8f4-c8a1-4a8c-a8c1-a8c1a8c1a8c1'::uuid, 'ihram-rules', 'Ihram Rules and Prohibitions', 'ihram', E'- Do not cut hair or nails during Ihram\n- Avoid perfume after Ihram is worn\n- Avoid marital relations and arguments\n- Men should not cover the head or wear stitched clothing\n- Women should not cover the face or hands with veil/gloves\n- Keep Talbiyah and dhikr frequent', 8, true, now(), now()),

  -- Duas
  ('8c98c9f4-c9a1-4a9c-a9c1-a9c1a9c1a9c1'::uuid, 'essential-duas', 'Essential Duas (Transliteration)', 'duas', E'Talbiyah:\n- Labbayk Allahumma labbayk, labbayk la sharika laka labbayk, innal hamda wan-nimata laka wal-mulk, la sharika lak.\nBetween Rukn Yamani and Black Stone:\n- Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina adhaban-nar.\nDua at Arafat (general):\n- Allahumma inni as-aluka al-afwa wal-afiyah.\nIstighfar:\n- Astaghfirullah.', 9, true, now(), now()),

  -- Videos
  ('8c98ca4-caal-4aac-aac1-aac1aac1aac1'::uuid, 'video-tutorials', 'Video Tutorials', 'videos', E'Recommended topics (links will be added by admin):\n- Umrah step-by-step overview\n- Tawaf and Sai practical tips\n- Hajj days timeline and logistics\n- Jamarat safety guidance', 10, true, now(), now()),

  -- Maps
  ('8c98cb4-cbal-4abc-abc1-abc1abc1abc1'::uuid, 'interactive-maps', 'Interactive Maps', 'maps', E'- Mina: https://maps.google.com/?q=Mina\n- Arafat: https://maps.google.com/?q=Mount+Arafat\n- Muzdalifah: https://maps.google.com/?q=Muzdalifah\n- Masjid al-Haram: https://maps.google.com/?q=Masjid+al+Haram\n- Masjid an-Nabawi: https://maps.google.com/?q=Masjid+an+Nabawi', 11, true, now(), now());
