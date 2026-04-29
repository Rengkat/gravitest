import {
  ExamType, QuestionFormat, DifficultyLevel, QuestionStatus,
  QuestionBankStats, ExamCategoryMeta, ExamMeta, YearMeta,
  SubjectMeta, Question,
} from "@/types/questions";

// ── Bank-level stats ──────────────────────────────────────────────────────

export const BANK_STATS: QuestionBankStats = {
  total:            24580,
  active:           22150,
  inactive:          1430,
  draft:             1000,
  archived:            0,
  byFormat: {
    MCQ:       15200,
    THEORY:     5800,
    PRACTICAL:  2100,
    ALL:        1480,
  },
  byDifficulty: {
    easy:   8200,
    medium: 10500,
    hard:    5880,
  },
  recentlyAdded:   345,
  totalUsage: 2_458_000,
  avgQualityScore:  92,
};

// ── Exam categories ───────────────────────────────────────────────────────

export const EXAM_CATEGORIES: ExamCategoryMeta[] = [
  {
    id:             "secondary",
    name:           "Secondary School Exams",
    examTypes:      ["JAMB", "WAEC", "NECO", "NABTEB", "BECE", "JUNIOR_NECO"],
    totalQuestions: 18500,
    byFormat:       { MCQ: 12000, THEORY: 4500, PRACTICAL: 1500, ALL: 500 },
    yearsOfData:    25,
  },
  {
    id:             "professional",
    name:           "Professional Exams",
    examTypes:      ["ICAN", "NMCN", "CIPM", "NIM", "NIESV"],
    totalQuestions:  4200,
    byFormat:       { MCQ: 2500, THEORY: 1200, PRACTICAL: 300, ALL: 200 },
    yearsOfData:    15,
  },
];

// ── Per-exam metadata ─────────────────────────────────────────────────────

export const EXAM_META: Record<ExamType, ExamMeta> = {
  JAMB: {
    examType: "JAMB", name: "JAMB", fullName: "UTME",
    description: "Unified Tertiary Matriculation Examination — computer-based test",
    category: "secondary",
    supportedFormats: ["MCQ"],
    isMultipleChoiceOnly: true,
    subjects: ["Mathematics","English","Physics","Chemistry","Biology","Economics","Government","Literature","Commerce","Geography","History","CRS","IRS","French","Yoruba","Hausa","Igbo"],
    totalQuestions: 8500, yearsCovered: 25, avgQualityScore: 94,
  },
  WAEC: {
    examType: "WAEC", name: "WAEC", fullName: "SSCE",
    description: "West African Senior School Certificate Examination",
    category: "secondary",
    supportedFormats: ["MCQ","THEORY","PRACTICAL","ALL"],
    isMultipleChoiceOnly: false,
    subjects: ["Mathematics","English","Physics","Chemistry","Biology","Economics","Government","Literature","Geography","Agricultural Science","Further Mathematics","Technical Drawing","Food & Nutrition","Home Economics","CRS","IRS","Commerce","History"],
    totalQuestions: 4200, yearsCovered: 25, avgQualityScore: 91,
  },
  NECO: {
    examType: "NECO", name: "NECO", fullName: "SSCE",
    description: "National Examination Council Senior School Certificate",
    category: "secondary",
    supportedFormats: ["MCQ","THEORY","PRACTICAL","ALL"],
    isMultipleChoiceOnly: false,
    subjects: ["Mathematics","English","Physics","Chemistry","Biology","Economics","Government","Literature","Geography","Further Mathematics","Agricultural Science","Home Economics","Commerce","CRS","IRS","History"],
    totalQuestions: 3100, yearsCovered: 20, avgQualityScore: 90,
  },
  NABTEB: {
    examType: "NABTEB", name: "NABTEB", fullName: "Technical",
    description: "National Business and Technical Examinations Board",
    category: "secondary",
    supportedFormats: ["MCQ","THEORY","PRACTICAL","ALL"],
    isMultipleChoiceOnly: false,
    subjects: ["Mathematics","English","Physics","Chemistry","Biology","Technical Drawing","Building Construction","Electrical Installation","Woodwork","Metalwork","Auto Mechanics","Computer Studies"],
    totalQuestions: 1200, yearsCovered: 15, avgQualityScore: 88,
  },
  BECE: {
    examType: "BECE", name: "BECE", fullName: "Junior",
    description: "Basic Education Certificate Examination",
    category: "secondary",
    supportedFormats: ["MCQ","THEORY"],
    isMultipleChoiceOnly: false,
    subjects: ["Mathematics","English","Basic Science","Social Studies","Civic Education","Christian Studies","Islamic Studies","Home Economics","Agricultural Science","Business Studies","French","CCA"],
    totalQuestions: 900, yearsCovered: 15, avgQualityScore: 87,
  },
  JUNIOR_NECO: {
    examType: "JUNIOR_NECO", name: "Junior NECO", fullName: "JSS",
    description: "Junior Secondary Certificate Examination",
    category: "secondary",
    supportedFormats: ["MCQ","THEORY"],
    isMultipleChoiceOnly: false,
    subjects: ["Mathematics","English","Basic Science","Social Studies","Civic Education","PVS","Business Studies","French","CCA","Home Economics"],
    totalQuestions: 600, yearsCovered: 12, avgQualityScore: 86,
  },
  ICAN: {
    examType: "ICAN", name: "ICAN", fullName: "Professional",
    description: "Institute of Chartered Accountants of Nigeria",
    category: "professional",
    supportedFormats: ["MCQ"],
    isMultipleChoiceOnly: true,
    subjects: ["Financial Accounting","Management Accounting","Taxation","Audit & Assurance","Corporate Law","Business Finance"],
    totalQuestions: 1500, yearsCovered: 15, avgQualityScore: 93,
  },
  NMCN: {
    examType: "NMCN", name: "NMCN", fullName: "Professional",
    description: "Nursing and Midwifery Council of Nigeria",
    category: "professional",
    supportedFormats: ["MCQ"],
    isMultipleChoiceOnly: true,
    subjects: ["Nursing Fundamentals","Medical-Surgical","Pediatrics","Mental Health","Community Health","Obstetrics"],
    totalQuestions: 1200, yearsCovered: 12, avgQualityScore: 91,
  },
  CIPM: {
    examType: "CIPM", name: "CIPM", fullName: "Professional",
    description: "Chartered Institute of Personnel Management",
    category: "professional",
    supportedFormats: ["MCQ"],
    isMultipleChoiceOnly: true,
    subjects: ["HR Management","Organisational Behaviour","Employment Law","Training & Development","Compensation Management"],
    totalQuestions: 600, yearsCovered: 10, avgQualityScore: 89,
  },
  NIM: {
    examType: "NIM", name: "NIM", fullName: "Professional",
    description: "Nigerian Institute of Management",
    category: "professional",
    supportedFormats: ["MCQ"],
    isMultipleChoiceOnly: true,
    subjects: ["Management Principles","Strategic Management","Operations Management","Marketing Management","Entrepreneurship"],
    totalQuestions: 500, yearsCovered: 10, avgQualityScore: 88,
  },
  NIESV: {
    examType: "NIESV", name: "NIESV", fullName: "Professional",
    description: "Nigerian Institution of Estate Surveyors & Valuers",
    category: "professional",
    supportedFormats: ["MCQ"],
    isMultipleChoiceOnly: true,
    subjects: ["Property Valuation","Real Estate Law","Property Management","Land Economics","Urban Planning"],
    totalQuestions: 400, yearsCovered: 10, avgQualityScore: 87,
  },
};

// ── Topics per subject (shared across exams) ──────────────────────────────

export const TOPICS_BY_SUBJECT: Record<string, string[]> = {
  Mathematics:       ["Algebra", "Calculus", "Trigonometry", "Statistics & Probability", "Geometry", "Number Theory", "Sequences & Series", "Logarithms", "Matrices"],
  Physics:           ["Mechanics", "Thermodynamics", "Waves & Sound", "Electricity & Magnetism", "Optics", "Modern Physics", "Gravitational Field", "Atomic Structure"],
  Chemistry:         ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Electrochemistry", "Equilibrium", "Acids & Bases", "Periodicity", "Chemical Bonding"],
  Biology:           ["Cell Biology", "Genetics & Heredity", "Ecology", "Evolution", "Human Physiology", "Plant Biology", "Reproduction", "Classification"],
  English:           ["Comprehension", "Essay Writing", "Grammar", "Oral English", "Literature", "Summary Writing", "Letter Writing"],
  Economics:         ["Microeconomics", "Macroeconomics", "International Trade", "Public Finance", "Money & Banking", "Demand & Supply", "National Income"],
  Government:        ["Constitutional Law", "Political Systems", "Nigerian Government", "International Relations", "Electoral Systems", "Federalism"],
  Literature:        ["Prose", "Drama", "Poetry", "African Literature", "Literary Devices", "Oral Literature"],
  Geography:         ["Physical Geography", "Human Geography", "Map Reading", "Climate & Weather", "Population", "Economic Geography", "Geomorphology"],
  "Basic Science":   ["Living Things", "Physical Processes", "Matter", "Energy", "Earth Science", "Technology"],
  "Social Studies":  ["Family", "Citizenship", "Government", "Economy", "Environment", "Culture"],
};

// ── Years helper ──────────────────────────────────────────────────────────

export const ALL_YEARS = Array.from({ length: 25 }, (_, i) =>
  String(2025 - i)
);

// ── Derived helpers (simulate what an API would return) ───────────────────

export function getYearMeta(examType: ExamType): YearMeta[] {
  const meta = EXAM_META[examType];
  const yearsToShow = Math.min(meta.yearsCovered, ALL_YEARS.length);
  return ALL_YEARS.slice(0, yearsToShow).map((year) => {
    const base = Math.floor(meta.totalQuestions / yearsToShow);
    const total = Math.round(base * (0.7 + Math.random() * 0.6));
    const formats = meta.supportedFormats;
    const byFormat: Partial<Record<QuestionFormat, number>> = {};
    let rem = total;
    formats.forEach((f, i) => {
      if (i === formats.length - 1) { byFormat[f] = rem; }
      else { const n = Math.floor(total / formats.length); byFormat[f] = n; rem -= n; }
    });
    return { year, examType, totalQuestions: total, byFormat, subjects: meta.subjects.slice(0, 8) };
  });
}

export function getSubjectMeta(examType: ExamType): SubjectMeta[] {
  const meta = EXAM_META[examType];
  return meta.subjects.map((subject) => {
    const total = Math.floor(
      (meta.totalQuestions / meta.subjects.length) * (0.5 + Math.random() * 1)
    );
    const formats = meta.supportedFormats;
    const byFormat: Partial<Record<QuestionFormat, number>> = {};
    let rem = total;
    formats.forEach((f, i) => {
      if (i === formats.length - 1) { byFormat[f] = rem; }
      else { const n = Math.floor(total / formats.length); byFormat[f] = n; rem -= n; }
    });
    const topics = TOPICS_BY_SUBJECT[subject] ?? ["General"];
    return { subject, examType, totalQuestions: total, byFormat, topics, avgQualityScore: 80 + Math.floor(Math.random() * 18) };
  });
}

// ── Mock question list (simulates paginated API response) ─────────────────

const SAMPLE_QUESTIONS: Record<string, string[]> = {
  Mathematics: [
    "If 2x + 3 = 11, find the value of x.",
    "A train travels 120 km in 2 hours. What is its average speed?",
    "Find the sum of the arithmetic progression 3, 7, 11, ..., up to 10 terms.",
    "Solve the quadratic equation x² - 5x + 6 = 0.",
    "If log₂ 8 = x, find x.",
    "The angle of elevation of the top of a tower is 30°. If the tower is 50 m tall, find the horizontal distance.",
  ],
  Physics: [
    "A body of mass 5 kg moves with a velocity of 10 m/s. Calculate its kinetic energy.",
    "State Newton's second law of motion.",
    "A resistor of 10 Ω is connected to a 12 V battery. Calculate the current flowing through it.",
    "Define specific heat capacity and state its SI unit.",
    "Explain the photoelectric effect.",
  ],
  Chemistry: [
    "What is the molecular formula of ethanol?",
    "Balance the equation: H₂ + O₂ → H₂O.",
    "Name the type of bond formed between Na and Cl in sodium chloride.",
    "Calculate the pH of a 0.001 mol/L HCl solution.",
    "State Le Chatelier's principle.",
  ],
  Biology: [
    "State three differences between plant and animal cells.",
    "Define osmosis and give one example.",
    "What is the function of the mitochondria in a cell?",
    "Explain Mendel's first law of inheritance.",
    "Describe the process of photosynthesis.",
  ],
  English: [
    "Identify the literary device used in: 'The wind whispered through the trees.'",
    "Choose the word that is closest in meaning to 'benevolent': (A) Hostile (B) Kind (C) Angry (D) Jealous",
    "Write a letter to the principal of your school requesting permission for a field trip.",
    "Summarise the following passage in not more than 80 words.",
    "What is the plural of 'ox'?",
  ],
};

export function getMockQuestions(params: {
  examType?: ExamType;
  year?: string;
  subject?: string;
  topic?: string;
  format?: QuestionFormat | "";
  difficulty?: DifficultyLevel | "";
  status?: QuestionStatus | "";
  searchQuery?: string;
  page?: number;
  perPage?: number;
}): { questions: Question[]; total: number; page: number; perPage: number } {
  const {
    examType, year, subject, topic, format, difficulty,
    status, searchQuery, page = 1, perPage = 15,
  } = params;

  const formats: QuestionFormat[] = format
    ? [format]
    : examType && EXAM_META[examType]
    ? EXAM_META[examType].supportedFormats
    : ["MCQ", "THEORY", "PRACTICAL", "ALL"];

  const subjects = subject
    ? [subject]
    : examType && EXAM_META[examType]
    ? EXAM_META[examType].subjects.slice(0, 5)
    : ["Mathematics", "English", "Physics", "Chemistry", "Biology"];

  const difficulties: DifficultyLevel[] = difficulty
    ? [difficulty]
    : ["easy", "medium", "hard"];

  const statuses: QuestionStatus[] = status
    ? [status]
    : ["active", "active", "active", "active", "active", "draft", "inactive"];

  const years = year ? [year] : ALL_YEARS.slice(0, 10);

  // Generate a consistent set of 200 mock questions
  const all: Question[] = Array.from({ length: 200 }, (_, i) => {
    const sub = subjects[i % subjects.length];
    const samplePool = SAMPLE_QUESTIONS[sub] ?? SAMPLE_QUESTIONS["Mathematics"];
    const fmt = formats[i % formats.length];
    const diff = difficulties[i % difficulties.length];
    const yr = years[i % years.length];
    const et = examType ?? "JAMB";
    return {
      id: `Q-${et.slice(0, 3)}-${yr}-${String(i + 1).padStart(4, "0")}`,
      examType: et,
      subject: sub,
      year: yr,
      format: fmt,
      difficulty: diff,
      status: statuses[i % statuses.length],
      topic: (TOPICS_BY_SUBJECT[sub] ?? ["General"])[i % (TOPICS_BY_SUBJECT[sub]?.length ?? 1)],
      marks: fmt === "THEORY" ? 5 + (i % 10) : fmt === "PRACTICAL" ? 10 + (i % 5) : 1,
      question: samplePool[i % samplePool.length],
      options:
        fmt === "MCQ"
          ? ["A. Option one", "B. Option two", "C. Option three", "D. Option four"]
          : undefined,
      correctAnswer: fmt === "MCQ" ? (i % 4) : undefined,
      explanation: "This question tests understanding of fundamental concepts in " + sub + ".",
      usageCount: Math.floor(Math.random() * 5000),
      avgScore: 45 + Math.floor(Math.random() * 50),
      qualityScore: 70 + Math.floor(Math.random() * 30),
      createdAt: "2024-01-15",
      updatedAt: "2024-03-20",
      createdBy: "admin",
    };
  });

  // Apply search filter
  const filtered = all.filter((q) => {
    if (searchQuery) {
      const ql = searchQuery.toLowerCase();
      return (
        q.question.toLowerCase().includes(ql) ||
        q.subject.toLowerCase().includes(ql) ||
        q.topic.toLowerCase().includes(ql) ||
        q.id.toLowerCase().includes(ql)
      );
    }
    return true;
  });

  const start = (page - 1) * perPage;
  return {
    questions: filtered.slice(start, start + perPage),
    total: filtered.length,
    page,
    perPage,
  };
}
