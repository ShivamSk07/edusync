import { createServerFn } from "@tanstack/react-start";
import { getDrizzle } from "../db";
import { academicProfiles, studentProfiles } from "../db/schema";

export const createStudentProfile = createServerFn({ method: "POST" })
  .validator(
    (data: {
      name: string;
      email?: string;
      classLevel: string;
      board: string;
      state?: string | null;
      schoolName?: string;
      subjects?: string[];
    }) => data,
  )
  .handler(async ({ data }) => {
    const db = getDrizzle();

    const [student] = await db
      .insert(studentProfiles)
      .values({
        name: data.name,
        email: data.email || null,
      })
      .returning();

    await db.insert(academicProfiles).values({
      studentId: student.id,
      classLevel: data.classLevel,
      board: data.board,
      state: data.state || null,
      schoolName: data.schoolName || null,
      subjects: data.subjects?.join(", ") || null,
    });

    return {
      success: true,
      studentId: student.id,
    };
  });
import { eq } from "drizzle-orm";
export const getStudentProfile = createServerFn({ method: "GET" })
  .validator((data: { studentId: string }) => data)
  .handler(async ({ data }) => {
    const db = getDrizzle();

    const result = await db
      .select({
        student: studentProfiles,
        academic: academicProfiles,
      })
      .from(studentProfiles)
      .leftJoin(
        academicProfiles,
        eq(academicProfiles.studentId, studentProfiles.id),
      )
      .where(eq(studentProfiles.id, data.studentId))
      .limit(1);

    return result[0] ?? null;
  });