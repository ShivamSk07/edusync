export interface CareerPath {
  title: string;
  category: string;
  relatedSubjects: string[];
  description: string;
  skills: string[];
  beginnerSteps: string[];
  projectIdeas: string[];
  higherStudy: string[];
}

export const careerPaths: CareerPath[] = [
  {
    title: "Bioinformatics Scientist",
    category: "Biology + Computer Science",
    relatedSubjects: ["Biology", "Computer Science", "Mathematics"],
    description:
      "Uses biology, computing and data analysis to study biological information such as genes and proteins.",
    skills: ["Python", "Biology", "Statistics", "Data Analysis", "Genomics"],
    beginnerSteps: [
      "Learn basic Python",
      "Strengthen genetics and molecular biology",
      "Learn basic statistics",
      "Explore biological databases",
    ],
    projectIdeas: [
      "DNA sequence analysis project",
      "GC-content calculator",
      "Simple biological data dashboard",
    ],
    higherStudy: [
      "MSc Bioinformatics",
      "MSc Computational Biology",
      "MSc Biotechnology with computational specialization",
    ],
  },

  {
    title: "Chemist",
    category: "Chemistry",
    relatedSubjects: ["Chemistry", "Physics", "Mathematics"],
    description:
      "Studies substances, their properties and how chemical reactions can be understood and applied.",
    skills: [
      "Laboratory Techniques",
      "Analytical Chemistry",
      "Data Analysis",
      "Scientific Writing",
    ],
    beginnerSteps: [
      "Strengthen chemical fundamentals",
      "Practice laboratory techniques",
      "Learn scientific data interpretation",
      "Read introductory research papers",
    ],
    projectIdeas: [
      "Water-quality analysis",
      "pH comparison study",
      "Simple reaction-rate investigation",
    ],
    higherStudy: [
      "BSc Chemistry",
      "MSc Chemistry",
      "Analytical Chemistry",
      "Industrial Chemistry",
    ],
  },

  {
    title: "Data Scientist",
    category: "Mathematics + Computer Science",
    relatedSubjects: ["Mathematics", "Computer Science", "Statistics"],
    description:
      "Uses statistics, programming and data analysis to find patterns and answer practical questions using data.",
    skills: [
      "Python",
      "Statistics",
      "SQL",
      "Data Visualization",
      "Machine Learning",
    ],
    beginnerSteps: [
      "Learn Python",
      "Learn statistics",
      "Learn SQL",
      "Practice data visualization",
      "Build small datasets projects",
    ],
    projectIdeas: [
      "Student performance dashboard",
      "Weather-data analysis",
      "Public dataset exploration",
    ],
    higherStudy: [
      "MSc Data Science",
      "MSc Statistics",
      "MSc Artificial Intelligence",
      "MTech Data Science",
    ],
  },

  {
    title: "Software Developer",
    category: "Computer Science",
    relatedSubjects: ["Computer Science", "Mathematics"],
    description:
      "Designs, develops, tests and maintains software applications and digital products.",
    skills: [
      "Programming",
      "Data Structures",
      "Git",
      "Problem Solving",
      "Software Development",
    ],
    beginnerSteps: [
      "Learn one programming language",
      "Learn Git and GitHub",
      "Build small applications",
      "Learn basic data structures",
    ],
    projectIdeas: [
      "Study planner",
      "To-do application",
      "Student dashboard",
    ],
    higherStudy: [
      "BCA",
      "BSc Computer Science",
      "BTech Computer Science",
      "MCA",
    ],
  },

  {
    title: "Economist",
    category: "Economics + Mathematics",
    relatedSubjects: ["Economics", "Mathematics", "Statistics"],
    description:
      "Studies how resources, markets, policies and economic systems behave using economic theory and data.",
    skills: [
      "Economics",
      "Statistics",
      "Data Analysis",
      "Research",
      "Communication",
    ],
    beginnerSteps: [
      "Learn basic microeconomics",
      "Learn basic statistics",
      "Read economic reports",
      "Practice interpreting graphs and datasets",
    ],
    projectIdeas: [
      "Inflation trend analysis",
      "Household expenditure study",
      "Local economic data dashboard",
    ],
    higherStudy: [
      "BA Economics",
      "BSc Economics",
      "MA Economics",
      "MSc Economics",
    ],
  },

  {
    title: "Psychology Researcher",
    category: "Psychology + Social Science",
    relatedSubjects: ["Psychology", "Biology", "Statistics", "Social Science"],
    description:
      "Studies human behaviour and mental processes through research, observation and data analysis.",
    skills: [
      "Research Methods",
      "Statistics",
      "Scientific Writing",
      "Observation",
      "Data Analysis",
    ],
    beginnerSteps: [
      "Learn basic psychology",
      "Study research methodology",
      "Learn introductory statistics",
      "Read psychological research",
    ],
    projectIdeas: [
      "Student study-habit survey",
      "Screen-time behaviour survey",
      "Learning-method comparison",
    ],
    higherStudy: [
      "BA Psychology",
      "BSc Psychology",
      "MA Psychology",
      "MSc Psychology",
    ],
  },

  {
    title: "Environmental Scientist",
    category: "Biology + Chemistry + Geography",
    relatedSubjects: ["Biology", "Chemistry", "Geography"],
    description:
      "Studies environmental systems, pollution, ecosystems and ways to understand and manage environmental problems.",
    skills: [
      "Environmental Science",
      "Data Collection",
      "GIS",
      "Research",
      "Scientific Communication",
    ],
    beginnerSteps: [
      "Study ecology and environmental science",
      "Learn basic data collection",
      "Explore GIS",
      "Read environmental reports",
    ],
    projectIdeas: [
      "Local water-quality study",
      "Waste-management survey",
      "Local biodiversity documentation",
    ],
    higherStudy: [
      "BSc Environmental Science",
      "MSc Environmental Science",
      "Environmental Management",
      "Ecology",
    ],
  },

  {
    title: "Statistician",
    category: "Mathematics",
    relatedSubjects: ["Mathematics", "Statistics", "Computer Science"],
    description:
      "Uses mathematical and statistical methods to collect, analyse and interpret data.",
    skills: [
      "Statistics",
      "Probability",
      "R",
      "Python",
      "Data Visualization",
    ],
    beginnerSteps: [
      "Learn probability",
      "Learn descriptive statistics",
      "Learn spreadsheets",
      "Start learning R or Python",
    ],
    projectIdeas: [
      "Survey-data analysis",
      "Sports statistics project",
      "Student-performance analysis",
    ],
    higherStudy: [
      "BSc Statistics",
      "MSc Statistics",
      "Applied Statistics",
      "Biostatistics",
    ],
  },

  {
    title: "Journalist",
    category: "Languages + Social Science",
    relatedSubjects: ["English", "Languages", "History", "Political Science"],
    description:
      "Researches, verifies and communicates information through written, audio or visual journalism.",
    skills: [
      "Writing",
      "Research",
      "Interviewing",
      "Fact Checking",
      "Communication",
    ],
    beginnerSteps: [
      "Practice writing regularly",
      "Learn basic journalism ethics",
      "Follow reliable news sources",
      "Create a small writing portfolio",
    ],
    projectIdeas: [
      "Campus news newsletter",
      "Student interview series",
      "Local issue explainer",
    ],
    higherStudy: [
      "BA Journalism",
      "BJMC",
      "MA Journalism",
      "Mass Communication",
    ],
  },

  {
    title: "Graphic Designer",
    category: "Arts + Design",
    relatedSubjects: ["Fine Arts", "Computer Science", "English"],
    description:
      "Creates visual communication for digital and physical media.",
    skills: [
      "Visual Design",
      "Typography",
      "Layout",
      "Branding",
      "Design Software",
    ],
    beginnerSteps: [
      "Learn design fundamentals",
      "Study typography and layout",
      "Practice creating posters",
      "Build a portfolio",
    ],
    projectIdeas: [
      "Student magazine",
      "Brand identity project",
      "Event poster collection",
    ],
    higherStudy: [
      "BDes",
      "BFA",
      "Visual Communication",
      "Graphic Design",
    ],
  },

  {
    title: "Geospatial / GIS Analyst",
    category: "Geography + Technology",
    relatedSubjects: ["Geography", "Mathematics", "Computer Science"],
    description:
      "Works with geographic data and digital maps to understand locations, patterns and spatial relationships.",
    skills: [
      "GIS",
      "Mapping",
      "Geospatial Data",
      "Statistics",
      "Remote Sensing",
    ],
    beginnerSteps: [
      "Learn basic geography",
      "Explore GIS software",
      "Learn coordinate systems",
      "Practice working with maps",
    ],
    projectIdeas: [
      "Local land-use map",
      "College accessibility map",
      "Population-density visualization",
    ],
    higherStudy: [
      "BA/BSc Geography",
      "MSc Geoinformatics",
      "GIS",
      "Remote Sensing",
    ],
  },

  {
    title: "Public Policy Researcher",
    category: "Social Science",
    relatedSubjects: ["Political Science", "Economics", "Sociology", "History"],
    description:
      "Researches public problems, policies and their potential effects using evidence and analysis.",
    skills: [
      "Research",
      "Data Analysis",
      "Policy Writing",
      "Critical Thinking",
      "Communication",
    ],
    beginnerSteps: [
      "Study basic public policy",
      "Read government reports",
      "Learn research methods",
      "Practice evidence-based writing",
    ],
    projectIdeas: [
      "Education-policy analysis",
      "Local public-transport study",
      "Scholarship-access research",
    ],
    higherStudy: [
      "MA Public Policy",
      "MA Political Science",
      "MA Economics",
      "Development Studies",
    ],
  },

  {
    title: "Financial Analyst",
    category: "Commerce + Mathematics",
    relatedSubjects: ["Mathematics", "Economics", "Commerce", "Computer Science"],
    description:
      "Analyses financial information, business data and economic factors to support financial decision-making.",
    skills: [
      "Financial Analysis",
      "Excel",
      "Statistics",
      "Accounting",
      "Data Analysis",
    ],
    beginnerSteps: [
      "Learn basic accounting",
      "Learn spreadsheets",
      "Understand financial statements",
      "Study basic economics",
    ],
    projectIdeas: [
      "Company financial-data analysis",
      "Budget dashboard",
      "Personal-finance education project",
    ],
    higherStudy: [
      "BCom",
      "BBA Finance",
      "BA Economics",
      "MBA Finance",
    ],
  },
];