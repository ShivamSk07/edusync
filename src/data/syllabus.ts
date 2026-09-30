import type { BoardId, ClassLevel } from "./academics";

export type Topic = { id: string; title: string };

export type Chapter = {
  id: string;
  number: number;
  title: string;
  topics: Topic[];
};

export type SubjectSyllabus = {
  board: BoardId;
  state: string | null;
  classLevel: ClassLevel;
  subject: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
  chapters: Chapter[];
};

const NCERT_URL = "https://ncert.nic.in/textbook.php";
const VERIFIED_ON = "2026-09-26";

function ch(number: number, title: string, topics: string[] = []): Chapter {
  return {
    id: `${number}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    number,
    title,
    topics: topics.map((t, i) => ({ id: `${number}-${i}`, title: t })),
  };
}

/**
 * Chapter listings below are transcribed from the published contents pages of the
 * NCERT textbooks prescribed by CBSE. Nothing here is invented; when a
 * board/class/subject combination is not present, the UI must say the data is
 * being prepared rather than substituting another board's syllabus.
 */
const CBSE_12: Record<string, Chapter[]> = {
  Physics: [
    ch(1, "Electric Charges and Fields", ["Electric charge", "Coulomb's law", "Electric field", "Gauss's law"]),
    ch(2, "Electrostatic Potential and Capacitance", ["Electrostatic potential", "Equipotential surfaces", "Capacitors and capacitance", "Dielectrics"]),
    ch(3, "Current Electricity", ["Ohm's law", "Drift of electrons", "Combination of resistors", "Kirchhoff's rules", "Wheatstone bridge"]),
    ch(4, "Moving Charges and Magnetism", ["Magnetic force", "Biot-Savart law", "Ampere's circuital law", "Moving coil galvanometer"]),
    ch(5, "Magnetism and Matter", ["Bar magnet", "Magnetism and Gauss's law", "Magnetic properties of materials"]),
    ch(6, "Electromagnetic Induction", ["Faraday's law", "Lenz's law", "Eddy currents", "Inductance"]),
    ch(7, "Alternating Current", ["AC voltage applied to resistor, inductor, capacitor", "LCR circuits", "Transformers"]),
    ch(8, "Electromagnetic Waves", ["Displacement current", "Electromagnetic spectrum"]),
    ch(9, "Ray Optics and Optical Instruments", ["Reflection by spherical mirrors", "Refraction", "Total internal reflection", "Lenses", "Optical instruments"]),
    ch(10, "Wave Optics", ["Huygens principle", "Interference", "Diffraction", "Polarisation"]),
    ch(11, "Dual Nature of Radiation and Matter", ["Photoelectric effect", "Einstein's photoelectric equation", "Wave nature of matter"]),
    ch(12, "Atoms", ["Alpha-particle scattering", "Bohr model", "Spectral series"]),
    ch(13, "Nuclei", ["Atomic masses", "Mass-energy relation", "Radioactivity", "Nuclear energy"]),
    ch(14, "Semiconductor Electronics: Materials, Devices and Simple Circuits", ["Intrinsic and extrinsic semiconductors", "p-n junction", "Diode applications"]),
  ],
  Chemistry: [
    ch(1, "Solutions", ["Types of solutions", "Expressing concentration", "Raoult's law", "Colligative properties"]),
    ch(2, "Electrochemistry", ["Electrochemical cells", "Nernst equation", "Conductance", "Electrolysis", "Batteries", "Corrosion"]),
    ch(3, "Chemical Kinetics", ["Rate of reaction", "Order and molecularity", "Integrated rate equations", "Collision theory"]),
    ch(4, "The d- and f-Block Elements", ["Transition elements", "General trends", "Lanthanoids and actinoids"]),
    ch(5, "Coordination Compounds", ["Werner's theory", "Nomenclature", "Isomerism", "Bonding in coordination compounds"]),
    ch(6, "Haloalkanes and Haloarenes", ["Nomenclature", "Nature of C-X bond", "Substitution reactions"]),
    ch(7, "Alcohols, Phenols and Ethers", ["Classification", "Preparation", "Physical and chemical properties"]),
    ch(8, "Aldehydes, Ketones and Carboxylic Acids", ["Nomenclature", "Preparation", "Chemical reactions"]),
    ch(9, "Amines", ["Structure and classification", "Preparation", "Diazonium salts"]),
    ch(10, "Biomolecules", ["Carbohydrates", "Proteins", "Enzymes", "Vitamins", "Nucleic acids"]),
  ],
  Biology: [
    ch(1, "Sexual Reproduction in Flowering Plants", ["Flower structure", "Pollination", "Double fertilisation", "Seed and fruit"]),
    ch(2, "Human Reproduction", ["Male and female reproductive systems", "Gametogenesis", "Menstrual cycle", "Embryonic development"]),
    ch(3, "Reproductive Health", ["Population and birth control", "Infertility", "STIs"]),
    ch(4, "Principles of Inheritance and Variation", ["Mendel's laws", "Linkage and recombination", "Sex determination", "Genetic disorders"]),
    ch(5, "Molecular Basis of Inheritance", ["DNA structure", "Replication", "Transcription", "Genetic code", "Translation", "Human genome project"]),
    ch(6, "Evolution", ["Origin of life", "Evidences of evolution", "Natural selection", "Human evolution"]),
    ch(7, "Human Health and Disease", ["Common diseases", "Immunity", "AIDS and cancer", "Drug and alcohol abuse"]),
    ch(8, "Microbes in Human Welfare", ["Microbes in household products", "Industrial products", "Sewage treatment", "Biocontrol agents"]),
    ch(9, "Biotechnology: Principles and Processes", ["Tools of recombinant DNA technology", "Cloning vectors", "Bioreactors"]),
    ch(10, "Biotechnology and its Applications", ["Bt crops", "RNA interference", "Gene therapy", "Transgenic animals"]),
    ch(11, "Organisms and Populations", ["Habitat and niche", "Population attributes", "Population interactions"]),
    ch(12, "Ecosystem", ["Productivity", "Decomposition", "Energy flow", "Nutrient cycling"]),
    ch(13, "Biodiversity and Conservation", ["Patterns of biodiversity", "Loss of biodiversity", "Conservation strategies"]),
  ],
};

const CBSE_10: Record<string, Chapter[]> = {
  Science: [
    ch(1, "Chemical Reactions and Equations"),
    ch(2, "Acids, Bases and Salts"),
    ch(3, "Metals and Non-metals"),
    ch(4, "Carbon and its Compounds"),
    ch(5, "Life Processes"),
    ch(6, "Control and Coordination"),
    ch(7, "How do Organisms Reproduce?"),
    ch(8, "Heredity"),
    ch(9, "Light – Reflection and Refraction"),
    ch(10, "The Human Eye and the Colourful World"),
    ch(11, "Electricity"),
    ch(12, "Magnetic Effects of Electric Current"),
    ch(13, "Our Environment"),
  ],
  Mathematics: [
    ch(1, "Real Numbers"),
    ch(2, "Polynomials"),
    ch(3, "Pair of Linear Equations in Two Variables"),
    ch(4, "Quadratic Equations"),
    ch(5, "Arithmetic Progressions"),
    ch(6, "Triangles"),
    ch(7, "Coordinate Geometry"),
    ch(8, "Introduction to Trigonometry"),
    ch(9, "Some Applications of Trigonometry"),
    ch(10, "Circles"),
    ch(11, "Areas Related to Circles"),
    ch(12, "Surface Areas and Volumes"),
    ch(13, "Statistics"),
    ch(14, "Probability"),
  ],
};

const REGISTRY: Record<string, Record<string, Chapter[]>> = {
  "cbse|12": CBSE_12,
  "cbse|10": CBSE_10,
};

export const SYLLABUS_UNAVAILABLE_MESSAGE =
  "Syllabus data is currently being prepared for this board/class combination.";

export function getSubjectSyllabus(
  board: BoardId,
  classLevel: ClassLevel,
  state: string | null,
  subject: string,
): SubjectSyllabus | null {
  const chapters = REGISTRY[`${board}|${classLevel}`]?.[subject];
  if (!chapters) return null;
  return {
    board,
    state,
    classLevel,
    subject,
    sourceName: "NCERT textbook contents (prescribed by CBSE)",
    sourceUrl: NCERT_URL,
    lastVerified: VERIFIED_ON,
    chapters,
  };
}

export function hasSyllabusFor(board: BoardId, classLevel: ClassLevel) {
  return Boolean(REGISTRY[`${board}|${classLevel}`]);
}

export function availableSubjects(board: BoardId, classLevel: ClassLevel) {
  return Object.keys(REGISTRY[`${board}|${classLevel}`] ?? {});
}
