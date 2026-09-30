export type Mentor = {
  id: string;
  name: string;
  expertise: string;
  bio: string;
  subjects: string[];
  careerAreas: string[];
  imageUrl?: string;
  active: boolean;
};

export const mentors: Mentor[] = [
  {
    id: "mentor-001",
    name: "Dr. Ananya Sharma",
    expertise: "Biotechnology & Life Sciences",
    bio: "Research-oriented mentor helping students explore biotechnology, genetics, bioinformatics and higher education pathways.",
    subjects: ["Biology", "Biotechnology"],
    careerAreas: [
      "Biotechnology",
      "Bioinformatics",
      "Genetics",
      "Life Sciences",
    ],
    active: true,
  },

  {
    id: "mentor-002",
    name: "Dr. Rohan Mehta",
    expertise: "Chemistry & Pharmaceutical Sciences",
    bio: "Guides students interested in chemistry, pharmaceutical sciences, laboratory research and related academic pathways.",
    subjects: ["Chemistry"],
    careerAreas: [
      "Chemistry",
      "Pharmaceutical Sciences",
      "Chemical Research",
    ],
    active: true,
  },

  {
    id: "mentor-003",
    name: "Prof. Kavya Nair",
    expertise: "Mathematics, Data & Computing",
    bio: "Helps students understand pathways connecting mathematics, statistics, programming, data science and computational fields.",
    subjects: ["Mathematics", "Computer Science"],
    careerAreas: [
      "Data Science",
      "Statistics",
      "Computer Science",
      "Artificial Intelligence",
    ],
    active: true,
  },
];