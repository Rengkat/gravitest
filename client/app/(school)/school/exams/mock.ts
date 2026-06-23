import type {
  Exam,
  ClassExamStats,
  SchoolClass,
  SubjectExamStats,
  Question,
  CreateExamDto,
  CreateQuestionDto,
} from "./types";

export const MOCK_CLASSES: SchoolClass[] = [
  {
    classId: "class-001",
    className: "SS3 Science",
    classArm: "A",
    totalStudents: 35,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
  },
  {
    classId: "class-002",
    className: "SS3 Art",
    classArm: "B",
    totalStudents: 28,
    subjects: ["English", "Literature", "Government", "History", "CRS"],
  },
  {
    classId: "class-003",
    className: "SS3 Commercial",
    classArm: null,
    totalStudents: 30,
    subjects: ["Accounting", "Commerce", "Economics", "English", "Mathematics"],
  },
  {
    classId: "class-004",
    className: "SS2 Science",
    classArm: "A",
    totalStudents: 38,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
  },
  {
    classId: "class-005",
    className: "JSS3",
    classArm: "A",
    totalStudents: 42,
    subjects: ["Mathematics", "English", "Basic Science", "Social Studies"],
  },
];

const MOCK_QUESTIONS: Record<string, Question[]> = {
  "exam-001": [
    {
      id: "q-001",
      examId: "exam-001",
      type: "MCQ",
      topic: "Algebra",
      questionText: "Solve for x: 2x + 5 = 13",
      options: ["x = 3", "x = 4", "x = 5", "x = 6"],
      correctAnswer: "x = 4",
      explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
      marks: 5,
      difficulty: "EASY",
      orderIndex: 1,
      isActive: true,
      createdAt: new Date("2026-06-01"),
      updatedAt: new Date("2026-06-01"),
    },
    {
      id: "q-002",
      examId: "exam-001",
      type: "MCQ",
      topic: "Algebra",
      questionText: "What is the value of 3² + 4²?",
      options: ["7", "12", "25", "49"],
      correctAnswer: "25",
      explanation: "3² = 9, 4² = 16, 9 + 16 = 25",
      marks: 5,
      difficulty: "EASY",
      orderIndex: 2,
      isActive: true,
      createdAt: new Date("2026-06-01"),
      updatedAt: new Date("2026-06-01"),
    },
    {
      id: "q-003",
      examId: "exam-001",
      type: "THEORY",
      topic: "Algebra",
      questionText: "Solve the quadratic equation: x² - 5x + 6 = 0. Show all working.",
      options: undefined,
      correctAnswer: "x = 2 or x = 3",
      explanation: "Factorize: (x - 2)(x - 3) = 0, therefore x = 2 or x = 3",
      marks: 10,
      difficulty: "MEDIUM",
      orderIndex: 3,
      isActive: true,
      createdAt: new Date("2026-06-01"),
      updatedAt: new Date("2026-06-01"),
    },
  ],
  "exam-002": [
    {
      id: "q-004",
      examId: "exam-002",
      type: "MCQ",
      topic: "Mechanics",
      questionText: "What is Newton's first law of motion also known as?",
      options: [
        "Law of Inertia",
        "Law of Acceleration",
        "Action-Reaction Law",
        "Law of Gravitation",
      ],
      correctAnswer: "Law of Inertia",
      explanation:
        "Newton's first law is the Law of Inertia - an object at rest stays at rest unless acted upon by an external force.",
      marks: 5,
      difficulty: "EASY",
      orderIndex: 1,
      isActive: true,
      createdAt: new Date("2026-06-02"),
      updatedAt: new Date("2026-06-02"),
    },
    {
      id: "q-005",
      examId: "exam-002",
      type: "PRACTICAL",
      topic: "Mechanics",
      questionText:
        "Describe an experiment to verify Hooke's law. Include apparatus, procedure, and observations.",
      options: undefined,
      correctAnswer: "Detailed experimental description",
      explanation: "Students should describe using a spring, weights, ruler, and graph plotting.",
      marks: 15,
      difficulty: "HARD",
      orderIndex: 2,
      isActive: true,
      createdAt: new Date("2026-06-02"),
      updatedAt: new Date("2026-06-02"),
    },
  ],
};

// `let` (not `const`) because this acts as our mutable in-memory table.
let MOCK_EXAMS: Exam[] = [
  {
    id: "exam-001",
    schoolId: "school-001",
    classId: "class-001",
    className: "SS3 Science",
    classArm: "A",
    subject: "Mathematics",
    title: "First Term Mathematics Examination",
    term: "FIRST",
    termYear: "2025/2026",
    description: "Comprehensive mathematics exam covering algebra, geometry, and statistics.",
    totalMarks: 100,
    totalQuestions: 3,
    durationMinutes: 90,
    startDate: new Date("2026-06-15T09:00:00"),
    endDate: new Date("2026-06-15T10:30:00"),
    instruction: "Answer all questions. Show all working where necessary.",
    status: "PUBLISHED",
    questions: MOCK_QUESTIONS["exam-001"],
    totalStudents: 35,
    submittedCount: 28,
    averageScore: 72.5,
    passingScore: 40,
    isActive: true,
    createdAt: new Date("2026-06-01"),
    updatedAt: new Date("2026-06-01"),
  },
  {
    id: "exam-002",
    schoolId: "school-001",
    classId: "class-001",
    className: "SS3 Science",
    classArm: "A",
    subject: "Physics",
    title: "First Term Physics Assessment",
    term: "FIRST",
    termYear: "2025/2026",
    description: "Physics exam covering mechanics and thermodynamics.",
    totalMarks: 100,
    totalQuestions: 2,
    durationMinutes: 120,
    startDate: new Date("2026-06-20T10:00:00"),
    endDate: new Date("2026-06-20T12:00:00"),
    instruction: "Answer all questions. Show all working.",
    status: "PUBLISHED",
    questions: MOCK_QUESTIONS["exam-002"],
    totalStudents: 35,
    submittedCount: 0,
    averageScore: undefined,
    passingScore: 40,
    isActive: true,
    createdAt: new Date("2026-06-02"),
    updatedAt: new Date("2026-06-02"),
  },
  {
    id: "exam-003",
    schoolId: "school-001",
    classId: "class-001",
    className: "SS3 Science",
    classArm: "A",
    subject: "Chemistry",
    title: "Chemistry Quiz - Organic Chemistry",
    term: "FIRST",
    termYear: "2025/2026",
    description: "Quiz on organic chemistry concepts.",
    totalMarks: 50,
    totalQuestions: 0,
    durationMinutes: 30,
    startDate: new Date("2026-06-25T11:00:00"),
    endDate: new Date("2026-06-25T11:30:00"),
    instruction: "Answer all questions.",
    status: "DRAFT",
    questions: [],
    totalStudents: 35,
    submittedCount: 0,
    averageScore: undefined,
    passingScore: 25,
    isActive: true,
    createdAt: new Date("2026-06-05"),
    updatedAt: new Date("2026-06-05"),
  },
  {
    id: "exam-004",
    schoolId: "school-001",
    classId: "class-002",
    className: "SS3 Art",
    classArm: "B",
    subject: "English",
    title: "First Term English Literature",
    term: "FIRST",
    termYear: "2025/2026",
    description: "Literature exam on prescribed texts.",
    totalMarks: 80,
    totalQuestions: 0,
    durationMinutes: 90,
    startDate: new Date("2026-06-18T09:00:00"),
    endDate: new Date("2026-06-18T10:30:00"),
    instruction: "Answer three questions from section A and one from section B.",
    status: "DRAFT",
    questions: [],
    totalStudents: 28,
    submittedCount: 0,
    averageScore: undefined,
    passingScore: 30,
    isActive: true,
    createdAt: new Date("2026-06-03"),
    updatedAt: new Date("2026-06-03"),
  },
];

/** Simulates network latency so loading states are exercised honestly. */
const delay = <T>(value: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

// ---------------------------------------------------------------------------
// Classes
// ---------------------------------------------------------------------------

export async function fetchClasses(): Promise<SchoolClass[]> {
  return delay(MOCK_CLASSES);
}

export async function fetchClassById(classId: string): Promise<SchoolClass | undefined> {
  return delay(MOCK_CLASSES.find((c) => c.classId === classId));
}

// ---------------------------------------------------------------------------
// Exams
// ---------------------------------------------------------------------------

export async function fetchExams(): Promise<Exam[]> {
  return delay(MOCK_EXAMS);
}

export async function fetchExamById(id: string): Promise<Exam | undefined> {
  return delay(MOCK_EXAMS.find((exam) => exam.id === id));
}

export async function fetchExamsByClassId(classId: string): Promise<Exam[]> {
  return delay(MOCK_EXAMS.filter((exam) => exam.classId === classId));
}

export async function createExam(dto: CreateExamDto): Promise<Exam> {
  const schoolClass = MOCK_CLASSES.find((c) => c.classId === dto.classId);
  const newExam: Exam = {
    id: `exam-${Date.now()}`,
    schoolId: "school-001",
    className: schoolClass?.className ?? "Unknown Class",
    classArm: schoolClass?.classArm ?? null,
    totalQuestions: 0,
    submittedCount: 0,
    status: "DRAFT",
    questions: [],
    isActive: true,
    totalStudents: schoolClass?.totalStudents ?? 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...dto,
  };
  MOCK_EXAMS = [newExam, ...MOCK_EXAMS];
  return delay(newExam, 200);
}

export async function deleteExam(examId: string): Promise<void> {
  MOCK_EXAMS = MOCK_EXAMS.filter((e) => e.id !== examId);
  return delay(undefined, 150);
}

export async function addQuestionToExam(
  examId: string,
  dto: CreateQuestionDto,
): Promise<Exam | undefined> {
  const exam = MOCK_EXAMS.find((e) => e.id === examId);
  if (!exam) return undefined;

  const newQuestion: Question = {
    id: `q-${Date.now()}`,
    examId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    orderIndex: dto.orderIndex ?? exam.questions.length + 1,
    ...dto,
  };

  exam.questions = [...exam.questions, newQuestion];
  exam.totalQuestions = exam.questions.length;
  exam.totalMarks = exam.questions.reduce((sum, q) => sum + q.marks, 0);
  exam.updatedAt = new Date();

  return delay(exam, 150);
}

export async function removeQuestionFromExam(
  examId: string,
  questionId: string,
): Promise<Exam | undefined> {
  const exam = MOCK_EXAMS.find((e) => e.id === examId);
  if (!exam) return undefined;

  exam.questions = exam.questions.filter((q) => q.id !== questionId);
  exam.totalQuestions = exam.questions.length;
  exam.totalMarks = exam.questions.reduce((sum, q) => sum + q.marks, 0);
  exam.updatedAt = new Date();

  return delay(exam, 150);
}

// ---------------------------------------------------------------------------
// Derived stats (pure functions — no I/O — so they're trivially testable)
// ---------------------------------------------------------------------------

export function computeOverallStats(exams: Exam[]) {
  const scored = exams.filter((e) => typeof e.averageScore === "number");
  return {
    totalExams: exams.length,
    draftExams: exams.filter((e) => e.status === "DRAFT").length,
    publishedExams: exams.filter((e) => e.status === "PUBLISHED").length,
    ongoingExams: exams.filter((e) => e.status === "ONGOING").length,
    completedExams: exams.filter((e) => e.status === "COMPLETED").length,
    totalQuestions: exams.reduce((sum, e) => sum + e.totalQuestions, 0),
    averageMarks: scored.length
      ? Math.round(scored.reduce((sum, e) => sum + (e.averageScore ?? 0), 0) / scored.length)
      : 0,
  };
}

export function computeClassExamStats(
  schoolClass: SchoolClass,
  classExams: Exam[],
): ClassExamStats {
  const scored = classExams.filter((e) => typeof e.averageScore === "number");
  return {
    classId: schoolClass.classId,
    className: schoolClass.className,
    classArm: schoolClass.classArm,
    totalStudents: schoolClass.totalStudents,
    totalExams: classExams.length,
    publishedExams: classExams.filter((e) => e.status === "PUBLISHED").length,
    completedExams: classExams.filter((e) => e.status === "COMPLETED").length,
    averageScore: scored.length
      ? Math.round(
          (scored.reduce((sum, e) => sum + (e.averageScore ?? 0), 0) / scored.length) * 10,
        ) / 10
      : null,
  };
}

/** All classes with their exam stats — what the overview grid renders. */
export async function fetchClassExamStats(): Promise<ClassExamStats[]> {
  const [classes, exams] = await Promise.all([fetchClasses(), fetchExams()]);
  return classes.map((schoolClass) =>
    computeClassExamStats(
      schoolClass,
      exams.filter((e) => e.classId === schoolClass.classId),
    ),
  );
}

/** Per-subject exam stats for one class — what the class detail page renders. */
export function computeSubjectExamStats(
  subjects: string[],
  classExams: Exam[],
): SubjectExamStats[] {
  return subjects.map((subject) => {
    const subjectExams = classExams.filter(
      (e) => e.subject.toLowerCase() === subject.toLowerCase(),
    );
    const scored = subjectExams.filter((e) => typeof e.averageScore === "number");
    return {
      subject,
      totalExams: subjectExams.length,
      publishedExams: subjectExams.filter((e) => e.status === "PUBLISHED").length,
      completedExams: subjectExams.filter((e) => e.status === "COMPLETED").length,
      totalQuestions: subjectExams.reduce((sum, e) => sum + e.totalQuestions, 0),
      averageScore: scored.length
        ? Math.round(
            (scored.reduce((sum, e) => sum + (e.averageScore ?? 0), 0) / scored.length) * 10,
          ) / 10
        : null,
    };
  });
}
