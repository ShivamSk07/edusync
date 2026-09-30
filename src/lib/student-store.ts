import { useCallback, useEffect, useState } from "react";
import type { BoardId, ClassLevel } from "@/data/academics";

export type StudentProfile = {
  name: string;
  classLevel: ClassLevel;
  board: BoardId;
  state: string | null;
  school: string;
  subjects: string[];
  createdAt: string;
};

export type StudyState = {
  /** key: `${subject}::${chapterId}` */
  completedChapters: string[];
  /** minutes studied per ISO date */
  studyMinutes: Record<string, number>;
  dailyTargetMinutes: number;
  lastOpened: { subject: string; chapter: string; at: string } | null;
};

const PROFILE_KEY = "edsync.profile";
const STUDY_KEY = "edsync.study";

export const EMPTY_STUDY: StudyState = {
  completedChapters: [],
  studyMinutes: {},
  dailyTargetMinutes: 120,
  lastOpened: null,
};

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("edsync:store"));
  } catch {
    /* storage unavailable */
  }
}

export function loadProfile() {
  return read<StudentProfile>(PROFILE_KEY);
}

export function saveProfile(profile: StudentProfile) {
  write(PROFILE_KEY, profile);
}

export function loadStudy() {
  return read<StudyState>(STUDY_KEY) ?? EMPTY_STUDY;
}

export function saveStudy(state: StudyState) {
  write(STUDY_KEY, state);
}

export function logStudyMinutes(dateIso: string, minutes: number) {
  const current = loadStudy();
  const existing = current.studyMinutes[dateIso] ?? 0;
  saveStudy({
    ...current,
    studyMinutes: {
      ...current.studyMinutes,
      [dateIso]: existing + minutes,
    },
  });
}

export function resetAll() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(STUDY_KEY);
    window.dispatchEvent(new Event("edsync:store"));
  } catch {
    /* storage unavailable */
  }
}

/** Client-only profile access; `hydrated` guards against SSR mismatch. */
export function useStudent() {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [study, setStudy] = useState<StudyState>(EMPTY_STUDY);

  const refresh = useCallback(() => {
    setProfile(loadProfile());
    setStudy(loadStudy());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);
    const onChange = () => refresh();
    window.addEventListener("edsync:store", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("edsync:store", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const updateProfile = useCallback((next: StudentProfile) => {
    saveProfile(next);
    setProfile(next);
  }, []);

  const updateStudy = useCallback((updater: (prev: StudyState) => StudyState) => {
    const next = updater(loadStudy());
    saveStudy(next);
    setStudy(next);
  }, []);

  return { hydrated, profile, study, updateProfile, updateStudy, refresh };
}

export function toggleChapterDone(subject: string, chapterId: string) {
  const state = loadStudy();
  const key = `${subject}::${chapterId}`;
  const completed = state.completedChapters.includes(key)
    ? state.completedChapters.filter((k) => k !== key)
    : [...state.completedChapters, key];
  saveStudy({ ...state, completedChapters: completed });
}

export function chapterKey(subject: string, chapterId: string) {
  return `${subject}::${chapterId}`;
}

export function studyStreak(studyMinutes: Record<string, number>) {
  let streak = 0;
  const day = new Date();
  for (;;) {
    const iso = day.toISOString().slice(0, 10);
    if ((studyMinutes[iso] ?? 0) > 0) {
      streak += 1;
      day.setDate(day.getDate() - 1);
    } else break;
  }
  return streak;
}
