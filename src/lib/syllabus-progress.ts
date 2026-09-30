import { getSubjectSyllabus } from "@/data/syllabus";
import type { StudentProfile, StudyState } from "@/lib/student-store";
import { chapterKey } from "@/lib/student-store";

export type SubjectProgress = {
  subject: string;
  available: boolean;
  total: number;
  completed: number;
  percent: number;
};

export function subjectProgressList(
  profile: StudentProfile,
  study: StudyState,
): SubjectProgress[] {
  return profile.subjects.map((subject) => {
    const syllabus = getSubjectSyllabus(profile.board, profile.classLevel, profile.state, subject);
    if (!syllabus) {
      return { subject, available: false, total: 0, completed: 0, percent: 0 };
    }
    const completed = syllabus.chapters.filter((chapter) =>
      study.completedChapters.includes(chapterKey(subject, chapter.id)),
    ).length;
    const total = syllabus.chapters.length;
    return {
      subject,
      available: true,
      total,
      completed,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  });
}

export function overallCompletion(list: SubjectProgress[]) {
  const total = list.reduce((sum, item) => sum + item.total, 0);
  const completed = list.reduce((sum, item) => sum + item.completed, 0);
  return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
}
