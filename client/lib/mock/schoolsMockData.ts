import type {
  SchoolData,
  SchoolClass,
  SchoolAdmin,
  SchoolType,
  SchoolStatus,
  SubscriptionPlan,
} from "@/types/schoolsTypes";
import {
  NIGERIAN_STATES,
  CLASS_LEVELS,
  CLASS_STREAMS,
  CORE_SUBJECTS,
  PLAN_LIMITS,
} from "@/lib/constants/schools";

function generateClass(level: string, stream?: string, schoolName?: string): SchoolClass {
  const className = stream ? `${level} ${stream}` : level;
  const classSubjects = [...CORE_SUBJECTS]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 7) + 8)
    .map((sub, idx) => ({
      id: `sub_${idx}`,
      name: sub.name,
      code: sub.code,
      category: sub.category,
      totalQuestions: Math.floor(Math.random() * 500) + 100,
      teachers: [
        ["Mr. Johnson", "Mrs. Adeyemi", "Dr. Okonkwo", "Ms. Bello"][Math.floor(Math.random() * 4)],
      ],
    }));

  return {
    id: `class_${Math.random().toString(36).substr(2, 9)}`,
    name: className,
    level,
    stream,
    totalStudents: Math.floor(Math.random() * 40) + 20,
    classAdmin: {
      id: `admin_${Math.random().toString(36).substr(2, 6)}`,
      name: [
        "Mr. Adebayo Oluwole",
        "Mrs. Chioma Obi",
        "Mr. Emeka Nwachukwu",
        "Mrs. Fatima Suleiman",
      ][Math.floor(Math.random() * 4)],
      email: `classadmin@${schoolName?.toLowerCase().replace(/ /g, "") || "school"}.edu.ng`,
      phone: `+234${Math.floor(Math.random() * 900000000 + 100000000)}`,
    },
    subjects: classSubjects,
    sessionsCompleted: Math.floor(Math.random() * 2000),
    averageScore: Math.floor(Math.random() * 30 + 55),
    status: Math.random() > 0.1 ? "active" : "inactive",
  };
}

export function generateMockSchools(count: number): SchoolData[] {
  const schoolNames = [
    "Lagos Preparatory School",
    "Abuja International Academy",
    "Ibadan Grammar School",
    "Port Harcourt High School",
    "Enugu College of Excellence",
    "Kaduna Unity School",
    "Benin City Academy",
    "Jos Metropolitan School",
    "Calabar International School",
    "Owerri Science Academy",
    "Abeokuta Grammar School",
    "Ilorin College",
    "Sokoto Leadership Academy",
    "Maiduguri Central School",
    "Warri Technical College",
    "Aba Commercial School",
    "Onitsha Secondary School",
    "Abakaliki Modern Academy",
    "Uyo International School",
    "Osogbo Grammar School",
  ];

  return Array.from({ length: count }, (_, i) => {
    const schoolName =
      schoolNames[i % schoolNames.length] +
      (i >= schoolNames.length ? ` ${Math.floor(i / schoolNames.length) + 1}` : "");
    const type = (["private", "private", "public", "international"] as SchoolType[])[
      Math.floor(Math.random() * 4)
    ];
    const state = NIGERIAN_STATES[Math.floor(Math.random() * NIGERIAN_STATES.length)];
    const plan = (["free", "basic", "pro", "enterprise"] as SubscriptionPlan[])[
      Math.floor(Math.random() * 4)
    ];

    const classes: SchoolClass[] = [];
    CLASS_LEVELS.forEach((level) => {
      if (["SS1", "SS2", "SS3"].includes(level)) {
        const streams =
          type === "international"
            ? CLASS_STREAMS
            : CLASS_STREAMS.slice(0, Math.floor(Math.random() * 3) + 1);
        streams.forEach((stream) => {
          if (Math.random() > 0.3) classes.push(generateClass(level, stream, schoolName));
        });
      } else {
        classes.push(generateClass(level, undefined, schoolName));
      }
    });

    const admins: SchoolAdmin[] = Array.from(
      { length: Math.floor(Math.random() * 3) + 2 },
      (_, j) => ({
        id: `admin_${i}_${j}`,
        name: ["Adebayo Ogunleye", "Chioma Eze", "Ibrahim Musa", "Ngozi Okonkwo", "Tunde Bakare"][
          Math.floor(Math.random() * 5)
        ],
        email: `admin${j}@${schoolName.toLowerCase().replace(/ /g, "")}.edu.ng`,
        phone: `+234${Math.floor(Math.random() * 900000000 + 100000000)}`,
        role: (j === 0
          ? "principal"
          : j === 1
            ? "vice_principal"
            : j === 2
              ? "admin"
              : "it_admin") as SchoolAdmin["role"],
        lastActive: new Date(
          2024,
          Math.floor(Math.random() * 3),
          Math.floor(Math.random() * 28) + 1,
        )
          .toISOString()
          .split("T")[0],
        status: Math.random() > 0.1 ? "active" : "inactive",
      }),
    );

    const totalStudents = classes.reduce((sum, c) => sum + c.totalStudents, 0);
    const limits = PLAN_LIMITS[plan];

    return {
      id: `sch_${(i + 1).toString().padStart(4, "0")}`,
      name: schoolName,
      code: `${state.substring(0, 2).toUpperCase()}${type.substring(0, 3).toUpperCase()}${(i + 1).toString().padStart(3, "0")}`,
      type,
      status: (["active", "active", "active", "inactive", "pending"] as SchoolStatus[])[
        Math.floor(Math.random() * 5)
      ],
      location: {
        address: `${Math.floor(Math.random() * 200) + 1} ${["Main Street", "College Road", "Academy Avenue", "School Lane", "Education Boulevard"][Math.floor(Math.random() * 5)]}`,
        city: [
          "Ikeja",
          "Wuse",
          "Ibadan North",
          "Port Harcourt",
          "Enugu North",
          "Kaduna South",
          "Benin City",
          "Jos North",
        ][Math.floor(Math.random() * 8)],
        state,
        country: "Nigeria",
        postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        coordinates: { lat: 6.5 + Math.random() * 6, lng: 3.5 + Math.random() * 10 },
      },
      contact: {
        phone: `+234${Math.floor(Math.random() * 900000000 + 100000000)}`,
        email: `info@${schoolName.toLowerCase().replace(/ /g, "")}.edu.ng`,
        website:
          Math.random() > 0.5
            ? `www.${schoolName.toLowerCase().replace(/ /g, "")}.edu.ng`
            : undefined,
      },
      subscription: {
        plan,
        status: (
          [
            "active",
            "active",
            "active",
            "trial",
            "expired",
          ] as SchoolData["subscription"]["status"][]
        )[Math.floor(Math.random() * 5)],
        startDate: new Date(2023, Math.floor(Math.random() * 12), 1).toISOString().split("T")[0],
        expiryDate: new Date(2024, Math.floor(Math.random() * 12) + 3, 1)
          .toISOString()
          .split("T")[0],
        maxStudents: limits.maxStudents,
        maxClasses: limits.maxClasses,
        features: limits.features,
      },
      stats: {
        totalStudents,
        activeStudents: Math.floor(totalStudents * (0.7 + Math.random() * 0.3)),
        totalClasses: classes.length,
        totalTeachers: Math.floor(classes.length * 1.5),
        totalAdmins: admins.length,
        sessionsCompleted: Math.floor(Math.random() * 50000),
        averagePerformance: Math.floor(Math.random() * 30 + 55),
        subscriptionUsage: Math.floor(Math.random() * 40 + 50),
        questionsAttempted: Math.floor(Math.random() * 100000),
        totalSpent: Math.floor(Math.random() * 5000000),
        loginRate: Math.floor(Math.random() * 30 + 60),
        completionRate: Math.floor(Math.random() * 20 + 70),
      },
      classes,
      admins,
      foundedYear: 1960 + Math.floor(Math.random() * 60),
      motto: [
        "Knowledge is Power",
        "Excellence Through Diligence",
        "Building Tomorrow's Leaders",
        "In Pursuit of Excellence",
      ][Math.floor(Math.random() * 4)],
      logo:
        Math.random() > 0.5
          ? `https://ui-avatars.com/api/?name=${schoolName.replace(/ /g, "+")}&background=1a4a2e&color=fff&size=128`
          : undefined,
      accreditation: ["WAEC", "NECO", "State Ministry of Education"].slice(
        0,
        Math.floor(Math.random() * 3) + 1,
      ),
      facilities: [
        "Computer Lab",
        "Science Laboratory",
        "Library",
        "Sports Complex",
        "Music Room",
        "Art Studio",
        "Cafeteria",
        "School Bus Service",
      ].slice(0, Math.floor(Math.random() * 5) + 2),
      createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split("T")[0],
      updatedAt: new Date(2024, 2, Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
    };
  });
}
