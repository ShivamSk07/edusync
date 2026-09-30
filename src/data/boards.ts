export type Board = {
  id: string;
  name: string;
  officialUrl: string;
  syllabusUrl: string;
  description: string;
};

export const boards: Board[] = [
  {
    id: "cbse",
    name: "CBSE",
    officialUrl: "https://www.cbse.gov.in/",
    syllabusUrl: "https://cbseacademic.nic.in/curriculum_2027.html",
    description:
      "Central Board of Secondary Education official academic curriculum and school resources.",
  },

  {
    id: "cisce",
    name: "CISCE / ICSE / ISC",
    officialUrl: "https://cisce.org/",
    syllabusUrl: "https://cisce.org/",
    description:
      "Council for the Indian School Certificate Examinations official information and syllabus resources.",
  },

  {
    id: "nios",
    name: "NIOS",
    officialUrl: "https://www.nios.ac.in/",
    syllabusUrl: "https://www.nios.ac.in/",
    description:
      "National Institute of Open Schooling official academic resources.",
  },

  {
    id: "mpbse",
    name: "Madhya Pradesh Board",
    officialUrl: "https://mpbse.nic.in/",
    syllabusUrl: "https://mpbse.nic.in/",
    description:
      "Madhya Pradesh Board of Secondary Education official resources.",
  },

  {
    id: "cgbse",
    name: "Chhattisgarh Board",
    officialUrl: "https://cgbse.nic.in/",
    syllabusUrl: "https://cgbse.nic.in/",
    description:
      "Chhattisgarh Board of Secondary Education official resources.",
  },

  {
    id: "upmsp",
    name: "Uttar Pradesh Board",
    officialUrl: "https://upmsp.edu.in/",
    syllabusUrl: "https://upmsp.edu.in/",
    description:
      "Uttar Pradesh Madhyamik Shiksha Parishad official resources.",
  },

  {
    id: "bseb",
    name: "Bihar Board",
    officialUrl: "https://secondary.biharboardonline.com/",
    syllabusUrl: "https://secondary.biharboardonline.com/",
    description:
      "Bihar School Examination Board official secondary education resources.",
  },

  {
    id: "rbse",
    name: "Rajasthan Board",
    officialUrl: "https://rajeduboard.rajasthan.gov.in/",
    syllabusUrl: "https://rajeduboard.rajasthan.gov.in/",
    description:
      "Board of Secondary Education Rajasthan official resources.",
  },

  {
    id: "gseb",
    name: "Gujarat Board",
    officialUrl: "https://www.gseb.org/",
    syllabusUrl: "https://www.gseb.org/",
    description:
      "Gujarat Secondary and Higher Secondary Education Board official resources.",
  },

  {
    id: "msbshse",
    name: "Maharashtra Board",
    officialUrl: "https://mahahsscboard.in/",
    syllabusUrl: "https://mahahsscboard.in/",
    description:
      "Maharashtra State Board of Secondary and Higher Secondary Education official resources.",
  },

  {
    id: "kseab",
    name: "Karnataka Board",
    officialUrl: "https://kseab.karnataka.gov.in/",
    syllabusUrl: "https://kseab.karnataka.gov.in/",
    description:
      "Karnataka School Examination and Assessment Board official resources.",
  },

  {
    id: "tndge",
    name: "Tamil Nadu Board",
    officialUrl: "https://www.dge.tn.gov.in/",
    syllabusUrl: "https://www.dge.tn.gov.in/",
    description:
      "Tamil Nadu Directorate of Government Examinations official resources.",
  },

  {
    id: "wbchse",
    name: "West Bengal Board",
    officialUrl: "https://wbchse.wb.gov.in/",
    syllabusUrl: "https://wbchse.wb.gov.in/",
    description:
      "West Bengal Council of Higher Secondary Education official resources.",
  },
];

export const getBoardById = (boardId: string | undefined) => {
  if (!boardId) return undefined;

  return boards.find((board) => board.id === boardId);
};