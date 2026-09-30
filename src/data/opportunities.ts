export type OpportunityType =
  | "Scholarship"
  | "Internship"
  | "Fellowship"
  | "Government Scheme"
  | "Competition"
  | "Learning Program";

export interface Opportunity {
  title: string;
  organization: string;
  type: OpportunityType;
  eligibility: string;
  deadline: string;
  officialUrl: string;
  sourceName: string;
  sourceType: "official_portal" | "official_organization";
  lastVerified: string;
}

export const opportunities: Opportunity[] = [
  {
    title:
      "National Scholarship Portal - Academic Year 2026-27",
    organization: "Government of India",
    type: "Scholarship",
    eligibility:
      "Students can explore scholarship schemes available through the National Scholarship Portal and check the eligibility requirements for each scheme.",
    deadline: "Varies by scheme",
    officialUrl: "https://scholarships.gov.in/",
    sourceName: "National Scholarship Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-27",
  },

  {
    title:
      "PM-USP Central Sector Scheme of Scholarship for College and University Students",
    organization:
      "Department of Higher Education, Ministry of Education",
    type: "Scholarship",
    eligibility:
      "Eligibility depends on the official scheme criteria. Check the National Scholarship Portal for current fresh or renewal requirements.",
    deadline: "31 October 2026",
    officialUrl: "https://scholarships.gov.in/",
    sourceName: "National Scholarship Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-27",
  },

  {
    title:
      "PM YASASVI Central Sector Scheme of Top Class Education in College for OBC, EBC and DNT Students",
    organization:
      "Department of Social Justice & Empowerment",
    type: "Scholarship",
    eligibility:
      "For eligible OBC, EBC and DNT students subject to the official scheme criteria and institutional requirements.",
    deadline: "31 October 2026",
    officialUrl: "https://scholarships.gov.in/",
    sourceName: "National Scholarship Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-27",
  },

  {
    title: "AICTE National Internship Portal",
    organization:
      "All India Council for Technical Education / Ministry of Education",
    type: "Internship",
    eligibility:
      "Students can explore internship opportunities and check the requirements of individual listings.",
    deadline: "Varies by internship",
    officialUrl: "https://internship.aicte-india.org/",
    sourceName: "AICTE National Internship Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-27",
  },

  {
    title: "Common Fellowship Portal",
    organization: "Government of India",
    type: "Fellowship",
    eligibility:
      "Explore fellowship opportunities and check the eligibility and application requirements of each fellowship.",
    deadline: "Varies by fellowship",
    officialUrl: "https://www.fellowships.gov.in/",
    sourceName: "Common Fellowship Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-27",
  },

  {
    title: "myScheme - Government Scheme Discovery",
    organization: "Government of India",
    type: "Government Scheme",
    eligibility:
      "Students and citizens can search government schemes using relevant eligibility criteria and personal information.",
    deadline: "Varies by scheme",
    officialUrl: "https://www.myscheme.gov.in/",
    sourceName: "myScheme",
    sourceType: "official_portal",
    lastVerified: "2026-09-27",
  },

  {
    title: "Government Education & Learning Opportunities",
    organization: "Government of India",
    type: "Learning Program",
    eligibility:
      "Explore education, learning and skill-development opportunities and check individual programme requirements.",
    deadline: "Varies by program",
    officialUrl: "https://www.myscheme.gov.in/",
    sourceName: "myScheme",
    sourceType: "official_portal",
    lastVerified: "2026-09-27",
  },

  {
    title: "Government Student & Youth Opportunities",
    organization: "Government of India",
    type: "Competition",
    eligibility:
      "Students should check the eligibility requirements and participation rules on the official opportunity page.",
    deadline: "Varies",
    officialUrl: "https://www.myscheme.gov.in/",
    sourceName: "myScheme",
    sourceType: "official_portal",
    lastVerified: "2026-09-27",
  },
];