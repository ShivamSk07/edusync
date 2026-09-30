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
  department: string;
}

export const opportunities: Opportunity[] = [
  {
    title: "National Scholarship Portal (NSP) Central Schemes 2026-27",
    organization: "Ministry of Electronics & IT / Ministry of Education, Govt. of India",
    type: "Scholarship",
    eligibility: "Pre-matric & post-matric students across all recognized state/central boards subject to family income & academic criteria.",
    deadline: "31 October 2026",
    officialUrl: "https://scholarships.gov.in/",
    sourceName: "National Scholarship Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-30",
    department: "Govt. of India",
  },
  {
    title: "PM-USP Central Sector Scheme for College and University Students",
    organization: "Department of Higher Education, Ministry of Education",
    type: "Scholarship",
    eligibility: "Above 80th percentile in relevant Class 12 board exam, pursuing regular college/university degree, family income < ₹4.5 LPA.",
    deadline: "31 October 2026",
    officialUrl: "https://scholarships.gov.in/",
    sourceName: "National Scholarship Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-30",
    department: "Ministry of Education",
  },
  {
    title: "DST INSPIRE Scholarship for Higher Education (SHE)",
    organization: "Department of Science and Technology (DST), Govt. of India",
    type: "Scholarship",
    eligibility: "Top 1% in Class 12 Board examinations pursuing B.Sc. / B.S. / Int. M.Sc. in Natural & Basic Sciences.",
    deadline: "30 November 2026",
    officialUrl: "https://online-inspire.gov.in/",
    sourceName: "DST INSPIRE Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-30",
    department: "Dept. of Science & Technology",
  },
  {
    title: "AICTE Pragati & Saksham Technical Scholarships",
    organization: "All India Council for Technical Education (AICTE)",
    type: "Scholarship",
    eligibility: "Female students and specially-abled students admitted to first-year AICTE-approved diploma or degree programs.",
    deadline: "31 December 2026",
    officialUrl: "https://www.aicte-india.org/schemes/students-development-schemes",
    sourceName: "AICTE Official Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-30",
    department: "Ministry of Education",
  },
  {
    title: "AICTE National Internship & Apprenticeship Portal",
    organization: "Ministry of Education & AICTE",
    type: "Internship",
    eligibility: "Undergraduate & school senior students across engineering, sciences, design, and commerce looking for verified industry & PSU internships.",
    deadline: "Rolling admissions",
    officialUrl: "https://internship.aicte-india.org/",
    sourceName: "AICTE Internship Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-30",
    department: "AICTE",
  },
  {
    title: "PM Research Fellowship (PMRF) Scheme",
    organization: "Ministry of Education / IITs / IISc Consortium",
    type: "Fellowship",
    eligibility: "Exceptional undergraduate and postgraduate students pursuing doctoral research in STEM fields at IISc/IITs/NITs.",
    deadline: "Varies by semester cycle",
    officialUrl: "https://www.pmrf.in/",
    sourceName: "PMRF Central Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-30",
    department: "Ministry of Education",
  },
  {
    title: "myScheme Central & State Government Scheme Discovery",
    organization: "National e-Governance Division (NeGD), Govt. of India",
    type: "Government Scheme",
    eligibility: "Search 1,000+ state and central educational subsidies, textbook assistance, fee waivers, and coaching support.",
    deadline: "Varies by state scheme",
    officialUrl: "https://www.myscheme.gov.in/",
    sourceName: "myScheme Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-30",
    department: "Digital India",
  },
  {
    title: "SWAYAM Free Online Courses & NPTEL Certification",
    organization: "Ministry of Education / NPTEL / IIT Madras",
    type: "Learning Program",
    eligibility: "Free enrollment for Class 9 to Postgraduate students across Sciences, Maths, Humanities, and Computer Programming.",
    deadline: "Semester-wise enrollment",
    officialUrl: "https://swayam.gov.in/",
    sourceName: "SWAYAM Central Portal",
    sourceType: "official_portal",
    lastVerified: "2026-09-30",
    department: "Ministry of Education",
  },
  {
    title: "National Career Service (NCS) Youth Opportunities",
    organization: "Ministry of Labour & Employment, Govt. of India",
    type: "Competition",
    eligibility: "Career counseling, vocational skill programs, and state-level youth competitions.",
    deadline: "Active year-round",
    officialUrl: "https://www.ncs.gov.in/",
    sourceName: "National Career Service",
    sourceType: "official_portal",
    lastVerified: "2026-09-30",
    department: "Ministry of Labour",
  },
];