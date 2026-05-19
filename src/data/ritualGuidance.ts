export type RitualGuidanceSectionSeed = {
  id: string;
  slug: string;
  title: string;
  section_group:
    | "general"
    | "before_departure"
    | "madinah"
    | "makkah"
    | "umrah"
    | "hajj"
    | "hajj_days"
    | "ihram"
    | "duas"
    | "videos"
    | "maps";
  body: string;
  sort_order: number;
  is_published: boolean;
};

export const fallbackRitualGuidance: RitualGuidanceSectionSeed[] = [
  {
    id: "rg-general",
    slug: "how-to-use-guide",
    title: "How to Use This Guide",
    section_group: "general",
    sort_order: 1,
    is_published: true,
    body: [
      "This manual gives a simple, step-by-step ritual overview for Hajj and Umrah.",
      "Please follow your group leader and consult a qualified scholar for any personal rulings.",
      "- Keep your passport, visa, and ID copies with you at all times",
      "- Stay hydrated and rest frequently",
      "- Follow your group schedule and meeting points",
      "- Be patient in crowds and protect the elderly",
    ].join("\n"),
  },
  {
    id: "rg-before",
    slug: "before-departure",
    title: "Before Departure Checklist",
    section_group: "before_departure",
    sort_order: 2,
    is_published: true,
    body: [
      "- Confirm passport validity, visa, and booking documents",
      "- Vaccinations completed (as required by authorities)",
      "- Pack Ihram, slippers, light clothing, and basic medicines",
      "- Learn basic rites and memorize key duas",
      "- Keep photocopies of documents and emergency contacts",
      "- Practice Ihram and Talbiyah before travel",
    ].join("\n"),
  },
  {
    id: "rg-umrah",
    slug: "umrah-step-by-step",
    title: "Umrah Step-by-Step",
    section_group: "umrah",
    sort_order: 3,
    is_published: true,
    body: [
      "- Enter Ihram at Miqat, make intention (niyyah), and begin Talbiyah",
      "- Enter Masjid al-Haram with right foot, make dua",
      "- Perform Tawaf: 7 circuits, Kaaba on left, begin at Black Stone",
      "- Pray 2 rakah behind Maqam Ibrahim if possible",
      "- Drink Zamzam and make dua",
      "- Perform Sai between Safa and Marwah (7 trips)",
      "- Men shave or trim hair; women trim a small portion",
    ].join("\n"),
  },
  {
    id: "rg-madinah",
    slug: "at-madinah",
    title: "At Madinah",
    section_group: "madinah",
    sort_order: 4,
    is_published: true,
    body: [
      "- Offer salah in Masjid an-Nabawi regularly",
      "- If possible, visit Rawdah during allocated times",
      "- Visit Masjid Quba and pray 2 rakah",
      "- Visit Uhud and remember the sacrifices of the Sahabah",
      "- Visit Jannat al-Baqi (men only, if open)",
    ].join("\n"),
  },
  {
    id: "rg-makkah",
    slug: "at-makkah",
    title: "At Makkah",
    section_group: "makkah",
    sort_order: 5,
    is_published: true,
    body: [
      "- Maintain wudu and keep your group contact details",
      "- Observe crowd safety during Tawaf and Sai",
      "- Use the designated entry/exit paths",
      "- Avoid pushing; focus on calm dhikr",
    ].join("\n"),
  },
  {
    id: "rg-hajj",
    slug: "hajj-step-by-step",
    title: "Hajj Step-by-Step (Summary)",
    section_group: "hajj",
    sort_order: 6,
    is_published: true,
    body: [
      "- 8th Dhul Hijjah: Enter Ihram for Hajj and go to Mina",
      "- 9th Dhul Hijjah: Stand at Arafat until Maghrib, then go to Muzdalifah",
      "- 10th Dhul Hijjah: Rami Jamrah Aqabah, sacrifice, shave/trim, Tawaf Ifadah and Sai",
      "- 11th-13th Dhul Hijjah: Rami all three Jamarat each day",
      "- Final Tawaf (Tawaf al-Wada) before leaving Makkah",
    ].join("\n"),
  },
  {
    id: "rg-hajj-days",
    slug: "during-hajj-days",
    title: "During Hajj Days",
    section_group: "hajj_days",
    sort_order: 7,
    is_published: true,
    body: [
      "- Mina: stay in your camp, follow the schedule",
      "- Arafat: this is the most important day; focus on dua and repentance",
      "- Muzdalifah: collect pebbles, rest, and pray Fajr",
      "- Jamarat: throw pebbles calmly with your group",
    ].join("\n"),
  },
  {
    id: "rg-ihram",
    slug: "ihram-rules",
    title: "Ihram Rules and Prohibitions",
    section_group: "ihram",
    sort_order: 8,
    is_published: true,
    body: [
      "- Do not cut hair or nails during Ihram",
      "- Avoid perfume after Ihram is worn",
      "- Avoid marital relations and arguments",
      "- Men should not cover the head or wear stitched clothing",
      "- Women should not cover the face or hands with veil/gloves",
      "- Keep Talbiyah and dhikr frequent",
    ].join("\n"),
  },
  {
    id: "rg-duas",
    slug: "essential-duas",
    title: "Essential Duas (Transliteration)",
    section_group: "duas",
    sort_order: 9,
    is_published: true,
    body: [
      "Talbiyah:",
      "- Labbayk Allahumma labbayk, labbayk la sharika laka labbayk, innal hamda wan-nimata laka wal-mulk, la sharika lak.",
      "Between Rukn Yamani and Black Stone:",
      "- Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina adhaban-nar.",
      "Dua at Arafat (general):",
      "- Allahumma inni as-aluka al-afwa wal-afiyah.",
      "Istighfar:",
      "- Astaghfirullah.",
    ].join("\n"),
  },
  {
    id: "rg-videos",
    slug: "video-tutorials",
    title: "Video Tutorials",
    section_group: "videos",
    sort_order: 10,
    is_published: true,
    body: [
      "Recommended topics (links will be added by admin):",
      "- Umrah step-by-step overview",
      "- Tawaf and Sai practical tips",
      "- Hajj days timeline and logistics",
      "- Jamarat safety guidance",
    ].join("\n"),
  },
  {
    id: "rg-maps",
    slug: "interactive-maps",
    title: "Interactive Maps",
    section_group: "maps",
    sort_order: 11,
    is_published: true,
    body: [
      "- Mina: https://maps.google.com/?q=Mina",
      "- Arafat: https://maps.google.com/?q=Mount+Arafat",
      "- Muzdalifah: https://maps.google.com/?q=Muzdalifah",
      "- Masjid al-Haram: https://maps.google.com/?q=Masjid+al+Haram",
      "- Masjid an-Nabawi: https://maps.google.com/?q=Masjid+an+Nabawi",
    ].join("\n"),
  },
];
