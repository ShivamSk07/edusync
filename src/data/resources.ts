export type Resource = {
  id: string;
  title: string;
  description: string;
  provider: string;
  type: "Syllabus" | "Textbook" | "Learning Platform" | "Practice";
  boards: string[];
  classes: string[];
  subjects: string[];
  officialUrl: string;
  downloadable: boolean;
};

export const resources: Resource[] = [
  {
    id: "diksha",
    title: "DIKSHA",
    description:
      "Government digital learning platform with textbooks, videos, courses, quizzes and curriculum-linked resources.",
    provider: "Ministry of Education / NCERT",
    type: "Learning Platform",
    boards: [
      "CBSE",
      "CISCE",
      "NIOS",
      "State Board",
    ],
    classes: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Science",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Hindi",
      "Social Science",
      "Computer Science",
      "History",
      "Geography",
      "Economics",
    ],
    officialUrl: "https://diksha.gov.in/exploreasstudent/",
    downloadable: true,
  },

  {
    id: "ncert",
    title: "NCERT Textbooks",
    description:
      "Official NCERT textbooks and educational material available for school students.",
    provider: "NCERT",
    type: "Textbook",
    boards: ["CBSE", "NIOS", "State Board"],
    classes: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Science",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Hindi",
      "Social Science",
    ],
    officialUrl: "https://ncert.nic.in/textbook.php",
    downloadable: true,
  },

  {
    id: "cbse-curriculum",
    title: "CBSE Academic Curriculum",
    description:
      "Official CBSE curriculum and syllabus information for the current academic session.",
    provider: "CBSE",
    type: "Syllabus",
    boards: ["CBSE"],
    classes: [
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Science",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Social Science",
      "Computer Science",
    ],
    officialUrl:
      "https://cbseacademic.nic.in/curriculum_2027.html",
    downloadable: true,
  },

  {
    id: "cbse-sample-papers",
    title: "CBSE Sample Question Papers",
    description:
      "Official CBSE sample question papers and marking schemes for board examination preparation.",
    provider: "CBSE Academic",
    type: "Practice",
    boards: ["CBSE"],
    classes: ["10", "12"],
    subjects: [
      "Mathematics",
      "Science",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Social Science",
      "Computer Science",
    ],
    officialUrl:
      "https://cbseacademic.nic.in/sqp_2026-27.html",
    downloadable: true,
  },

  {
    id: "cisce",
    title: "CISCE Official Resources",
    description:
      "Official CISCE information, regulations and curriculum-related resources for ICSE and ISC students.",
    provider: "CISCE",
    type: "Syllabus",
    boards: ["CISCE"],
    classes: [
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "History",
      "Geography",
      "Computer Science",
    ],
    officialUrl: "https://cisce.org/",
    downloadable: true,
  },

  {
    id: "nios-library",
    title: "NIOS Digital Library",
    description:
      "Official NIOS digital education and e-resource platform containing academic resources and e-books.",
    provider: "NIOS",
    type: "Learning Platform",
    boards: ["NIOS"],
    classes: [
      "10",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Social Science",
      "Computer Science",
    ],
    officialUrl: "https://digitallibrary.nios.ac.in/",
    downloadable: true,
  },

  {
    id: "mpbse",
    title: "Madhya Pradesh Board",
    description:
      "Official Madhya Pradesh Board education and examination resources.",
    provider: "MPBSE",
    type: "Syllabus",
    boards: ["Madhya Pradesh Board"],
    classes: [
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Hindi",
      "Social Science",
      "Computer Science",
    ],
    officialUrl: "https://mpbse.nic.in/",
    downloadable: true,
  },

  {
    id: "cgbse",
    title: "Chhattisgarh Board",
    description:
      "Official Chhattisgarh Board education and examination resources.",
    provider: "CGBSE",
    type: "Syllabus",
    boards: ["Chhattisgarh Board"],
    classes: [
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Hindi",
      "Social Science",
      "Computer Science",
    ],
    officialUrl: "https://cgbse.nic.in/",
    downloadable: true,
  },

  {
    id: "upmsp",
    title: "UP Board Official Resources",
    description:
      "Official Uttar Pradesh Board education and examination resources.",
    provider: "UPMSP",
    type: "Syllabus",
    boards: ["Uttar Pradesh Board"],
    classes: [
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Hindi",
      "Social Science",
    ],
    officialUrl: "https://upmsp.edu.in/",
    downloadable: true,
  },

  {
    id: "bseb",
    title: "Bihar Board Official Resources",
    description:
      "Official Bihar Board secondary and senior secondary education resources.",
    provider: "BSEB",
    type: "Syllabus",
    boards: ["Bihar Board"],
    classes: [
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Hindi",
      "Social Science",
    ],
    officialUrl:
      "https://secondary.biharboardonline.com/",
    downloadable: true,
  },

  {
    id: "rbse",
    title: "Rajasthan Board Official Resources",
    description:
      "Official Rajasthan Board education and examination resources.",
    provider: "RBSE",
    type: "Syllabus",
    boards: ["Rajasthan Board"],
    classes: [
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Hindi",
      "Social Science",
    ],
    officialUrl:
      "https://rajeduboard.rajasthan.gov.in/",
    downloadable: true,
  },

  {
    id: "msbshse",
    title: "Maharashtra Board Official Resources",
    description:
      "Official Maharashtra State Board education and examination resources.",
    provider: "MSBSHSE",
    type: "Syllabus",
    boards: ["Maharashtra Board"],
    classes: [
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Hindi",
      "Social Science",
      "Computer Science",
    ],
    officialUrl: "https://mahahsscboard.in/",
    downloadable: true,
  },

  {
    id: "kseab",
    title: "Karnataka Board Official Resources",
    description:
      "Official Karnataka School Examination and Assessment Board resources.",
    provider: "KSEAB",
    type: "Syllabus",
    boards: ["Karnataka Board"],
    classes: [
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Social Science",
      "Computer Science",
    ],
    officialUrl:
      "https://kseab.karnataka.gov.in/",
    downloadable: true,
  },

  {
    id: "tndge",
    title: "Tamil Nadu Board Official Resources",
    description:
      "Official Tamil Nadu Directorate of Government Examinations resources.",
    provider: "TNDGE",
    type: "Syllabus",
    boards: ["Tamil Nadu Board"],
    classes: [
      "9",
      "10",
      "11",
      "12",
    ],
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Social Science",
      "Computer Science",
    ],
    officialUrl: "https://www.dge.tn.gov.in/",
    downloadable: true,
  },
];

