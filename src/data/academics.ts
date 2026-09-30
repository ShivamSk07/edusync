export const CLASS_OPTIONS = ["6", "7", "8", "9", "10", "11", "12"] as const;
export type ClassLevel = (typeof CLASS_OPTIONS)[number];

export const BOARD_OPTIONS = [
  { id: "cbse", label: "CBSE", needsState: false },
  { id: "icse", label: "CISCE / ICSE", needsState: false },
  { id: "state", label: "State Board", needsState: true },
  { id: "other", label: "Other recognized board", needsState: false },
] as const;
export type BoardId = (typeof BOARD_OPTIONS)[number]["id"];

export function boardLabel(id: BoardId) {
  return BOARD_OPTIONS.find((b) => b.id === id)?.label ?? id;
}

export const STATE_OPTIONS = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Jammu & Kashmir",
  "Other / Union Territory",
] as const;

export const SUBJECT_OPTIONS_BY_STAGE = {
  middle: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit", "Computer Science"],
  secondary: [
    "Mathematics",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Social Science",
    "English",
    "Hindi",
    "Computer Applications",
  ],
  senior: [
    "Physics",
    "Chemistry",
    "Biology",
    "Mathematics",
    "English",
    "Computer Science",
    "Economics",
    "Accountancy",
    "Business Studies",
    "Political Science",
    "History",
    "Geography",
    "Psychology",
  ],
} as const;

export function subjectOptionsFor(classLevel: ClassLevel) {
  const n = Number(classLevel);
  if (n >= 11) return SUBJECT_OPTIONS_BY_STAGE.senior;
  if (n >= 9) return SUBJECT_OPTIONS_BY_STAGE.secondary;
  return SUBJECT_OPTIONS_BY_STAGE.middle;
}
