import type {
  LibraryContent, AccessCheckResult, LibraryAccessRecord,
  RatingEntry, RelatedContent,
} from "./types";

export function mockContent(id: string): LibraryContent {
  const seed = id.charCodeAt(id.length - 1) % 7;

  const base = {
    id, isActive: true, isPublished: true,
    totalViews: 4_820, totalDownloads: 1_240,
    averageRating: 4.6, ratingCount: 312,
    createdAt: "2024-09-01T00:00:00Z", updatedAt: "2025-03-15T00:00:00Z",
    examTypes: ["waec", "neco"] as any,
    classLevels: ["ss2", "ss3"] as any,
    tags: ["exam prep", "past questions", "2024"],
    author: "Gravitas Academic Team",
  };

  const contents: LibraryContent[] = [
    // 0 – Free Video
    {
      ...base, contentType: "video",
      title: "Complete WAEC Mathematics: Algebra & Calculus Masterclass",
      description: "A full walkthrough of WAEC Mathematics covering Algebra, Calculus, Trigonometry and Statistics. Taught by experienced examiners with real past question references.",
      subject: "mathematics", topic: "Algebra, Calculus, Trigonometry",
      fileUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
      thumbnailUrl: "https://picsum.photos/seed/mathvid/800/450",
      durationSeconds: 5_400, totalPages: null, fileSizeBytes: 420_000_000,
      isFree: true, requiredTier: null, priceKobo: null,
      previewSeconds: 90, author: "Mr. Adewale Obi (MSc, UNILAG)",
    },
    // 1 – Premium Video (tier-gated)
    {
      ...base, contentType: "video",
      title: "JAMB Biology: Genetics, Evolution & Ecology Deep Dive",
      description: "Comprehensive video series covering all JAMB Biology topics including detailed genetics problems, evolutionary theory and ecosystem analysis with 2024 syllabus updates.",
      subject: "biology", topic: "Genetics, Evolution, Ecology",
      fileUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
      thumbnailUrl: "https://picsum.photos/seed/biovid/800/450",
      durationSeconds: 7_200, totalPages: null, fileSizeBytes: 680_000_000,
      isFree: false, requiredTier: "premium", priceKobo: null,
      previewSeconds: 90, author: "Dr. Ngozi Eze (PhD, UNIPORT)",
    },
    // 2 – Free Ebook
    {
      ...base, contentType: "ebook",
      title: "NECO Chemistry: Comprehensive Theory & Practicals Guide",
      description: "400-page ebook covering every NECO Chemistry topic. Includes lab safety, organic chemistry, electrochemistry and titration calculations with worked examples.",
      subject: "chemistry", topic: "Organic Chemistry, Electrochemistry",
      fileUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF2.pdf",
      thumbnailUrl: "https://picsum.photos/seed/chemebook/800/450",
      durationSeconds: null, totalPages: 400, fileSizeBytes: 12_500_000,
      isFree: true, requiredTier: null, priceKobo: null,
      previewPages: 5, author: "Gravitas Academic Team",
    },
    // 3 – Paid Document
    {
      ...base, contentType: "document",
      title: "WAEC Economics: 20 Years of Past Questions with Model Answers",
      description: "Complete WAEC Economics past questions from 2003–2023 with full model answers, examiner comments and topic-by-topic breakdown.",
      subject: "economics", topic: "Macroeconomics, Microeconomics",
      fileUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF2.pdf",
      thumbnailUrl: "https://picsum.photos/seed/ecodoc/800/450",
      durationSeconds: null, totalPages: 280, fileSizeBytes: 8_200_000,
      isFree: false, requiredTier: null, priceKobo: 150_000,
      previewPages: 2, author: "Examcraft Nigeria",
    },
    // 4 – Free Audio
    {
      ...base, contentType: "audio",
      title: "English Language: Oral English & Comprehension Revision",
      description: "Audio series covering WAEC Oral English pronunciation, vowels, consonants, syllable stress and comprehension exercises narrated by a professional linguist.",
      subject: "english", topic: "Oral English, Comprehension",
      fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      thumbnailUrl: "https://picsum.photos/seed/engaudio/800/450",
      durationSeconds: 3_600, totalPages: null, fileSizeBytes: 52_000_000,
      isFree: true, requiredTier: null, priceKobo: null,
      previewSeconds: 60, author: "Mrs. Funke Adeyemi (Linguistics, LASU)",
    },
    // 5 – Lesson Note
    {
      ...base, contentType: "lesson_note",
      title: "SS2 Physics: Mechanics & Thermodynamics — Complete Lesson Notes",
      description: "Structured lesson notes for SS2 Physics covering Newtonian mechanics, heat transfer, thermodynamic laws and wave motion. Ideal for classroom use and self-study.",
      subject: "physics", topic: "Mechanics, Thermodynamics, Waves",
      fileUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF2.pdf",
      thumbnailUrl: "https://picsum.photos/seed/physnote/800/450",
      durationSeconds: null, totalPages: 85, fileSizeBytes: 3_400_000,
      isFree: false, requiredTier: "standard", priceKobo: null,
      previewPages: 2, author: "Gravitas Academic Team",
      classLevels: ["ss2"] as any, examTypes: ["waec", "neco"] as any,
    },
    // 6 – Past Questions paid
    {
      ...base, contentType: "past_question",
      title: "JAMB Mathematics: 10 Years CBT Past Questions (2014–2024)",
      description: "Complete JAMB Mathematics CBT past questions with full solutions and time-attack practice mode. Includes topic tagging and performance analytics.",
      subject: "mathematics", topic: "All JAMB Topics",
      fileUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF2.pdf",
      thumbnailUrl: "https://picsum.photos/seed/jambmaths/800/450",
      durationSeconds: null, totalPages: 320, fileSizeBytes: 9_800_000,
      isFree: false, requiredTier: null, priceKobo: 200_000,
      previewPages: 2, author: "Gravitas Academic Team",
      examTypes: ["jamb"] as any, classLevels: ["ss3"] as any,
    },
  ];

  return contents[seed] ?? contents[0];
}

export function mockAccessCheck(id: string): AccessCheckResult {
  const seed = id.charCodeAt(id.length - 1) % 7;
  // Seeds 0, 2, 4 = free; 1 = premium-gated; 3, 6 = paid no_access; 5 = standard-gated
  if ([0, 2, 4].includes(seed)) return { hasAccess: true, reason: "free" };
  return { hasAccess: false, reason: "no_access" };
}

export function mockAccessRecord(): LibraryAccessRecord {
  return {
    id: "access-001",
    userId: "user-001",
    contentId: "content-001",
    contentType: "video",
    expiresAt: null,
    viewCount: 7,
    downloadCount: 1,
    progressPercent: 42,
    lastAccessedAt: "2025-05-20T10:00:00Z",
    bookmarks: [
      { position: 120, note: "Important formula", createdAt: "2025-05-10T09:00:00Z" },
      { position: 900, note: "Worked example", createdAt: "2025-05-12T11:00:00Z" },
    ],
    highlights: null,
    paymentId: null,
    createdAt: "2025-04-01T00:00:00Z",
  };
}

export function mockRatings(): RatingEntry[] {
  return [
    { id: "r1", userId: "u1", userName: "Adewale O.",    avatarInitials: "AO", rating: 5, review: "Absolutely brilliant content. The explanations are clear and the worked examples match exactly what comes up in WAEC. Highly recommended for SS3 students.",    createdAt: "2025-05-01T10:00:00Z", helpful: 34 },
    { id: "r2", userId: "u2", userName: "Chidinma E.",   avatarInitials: "CE", rating: 5, review: "I used this to revise two weeks before my exam and my score improved significantly. The instructor breaks everything down very well.",                        createdAt: "2025-04-28T14:00:00Z", helpful: 28 },
    { id: "r3", userId: "u3", userName: "Femi A.",       avatarInitials: "FA", rating: 4, review: "Very comprehensive. Covers the full syllabus. Would have been 5 stars if there were more practice questions at the end of each section.",                    createdAt: "2025-04-20T09:30:00Z", helpful: 19 },
    { id: "r4", userId: "u4", userName: "Blessing N.",   avatarInitials: "BN", rating: 4, review: "Good content overall. The audio quality could be a little better in some sections but the explanations are top-notch.",                                      createdAt: "2025-04-15T16:00:00Z", helpful: 11 },
    { id: "r5", userId: "u5", userName: "Ibrahim K.",    avatarInitials: "IK", rating: 3, review: "Decent material but I expected more depth on thermodynamics. The other chapters are excellent though.",                                                       createdAt: "2025-04-10T11:00:00Z", helpful: 6  },
  ];
}

export function mockRelated(currentId: string): RelatedContent[] {
  return [
    { id: "rel-1", title: "WAEC Maths: Statistics & Probability",   contentType: "video",         thumbnailUrl: "https://picsum.photos/seed/rel1/400/225", averageRating: 4.7, isFree: true,  requiredTier: null, priceKobo: null, subject: "mathematics", durationSeconds: 3600, totalPages: null },
    { id: "rel-2", title: "SS3 Physics Complete Notes",             contentType: "lesson_note",   thumbnailUrl: "https://picsum.photos/seed/rel2/400/225", averageRating: 4.4, isFree: false, requiredTier: "standard", priceKobo: null, subject: "physics", durationSeconds: null, totalPages: 90 },
    { id: "rel-3", title: "NECO Chemistry Past Questions 2015–2024",contentType: "past_question", thumbnailUrl: "https://picsum.photos/seed/rel3/400/225", averageRating: 4.5, isFree: false, requiredTier: null, priceKobo: 100000, subject: "chemistry", durationSeconds: null, totalPages: 240 },
    { id: "rel-4", title: "Biology: Cell Structure & Metabolism",    contentType: "ebook",         thumbnailUrl: "https://picsum.photos/seed/rel4/400/225", averageRating: 4.8, isFree: true,  requiredTier: null, priceKobo: null, subject: "biology", durationSeconds: null, totalPages: 180 },
  ];
}
