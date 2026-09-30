import { mentors, type Mentor } from "@/data/mentors";

export type StudentMentorshipProfile = {
  subjects?: string[];
  careerGoal?: string;
};

export function getAvailableMentors(
  profile?: StudentMentorshipProfile,
): Mentor[] {
  const activeMentors = mentors.filter((mentor) => mentor.active);

  if (!profile) {
    return activeMentors;
  }

  const subjects = (profile.subjects ?? []).map((subject) =>
    subject.toLowerCase(),
  );

  const careerGoal = profile.careerGoal?.toLowerCase() ?? "";

  return activeMentors.filter((mentor) => {
    const subjectMatch = mentor.subjects.some((subject) =>
      subjects.includes(subject.toLowerCase()),
    );

    const careerMatch = mentor.careerAreas.some((area) =>
      careerGoal.includes(area.toLowerCase()),
    );

    return subjectMatch || careerMatch;
  });
}