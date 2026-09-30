import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const studentProfiles = pgTable("student_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  email: text("email").unique(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});


export const mentors = pgTable("mentors", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  email: text("email"),

  organization: text("organization"),

  qualification: text("qualification"),

  expertise: text("expertise"),

  subjects: text("subjects"),

  languages: text("languages"),

  bio: text("bio"),

  photoUrl: text("photo_url"),

  availability: text("availability"),

  maxStudents: integer("max_students").default(10).notNull(),

  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const mentorshipAssignments = pgTable("mentorship_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),

  mentorId: uuid("mentor_id")
    .notNull()
    .references(() => mentors.id, {
      onDelete: "cascade",
    }),

  studentId: uuid("student_id")
    .notNull()
    .references(() => studentProfiles.id, {
      onDelete: "cascade",
    }),

  status: text("status").default("active").notNull(),

  assignedAt: timestamp("assigned_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const academicProfiles = pgTable("academic_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),

  studentId: uuid("student_id")
    .notNull()
    .references(() => studentProfiles.id, {
      onDelete: "cascade",
    }),

  classLevel: text("class_level").notNull(),

  board: text("board").notNull(),

  state: text("state"),

  schoolName: text("school_name"),

  subjects: text("subjects"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const studyProgress = pgTable("study_progress", {
  id: uuid("id").defaultRandom().primaryKey(),

  studentId: uuid("student_id")
    .notNull()
    .references(() => studentProfiles.id, {
      onDelete: "cascade",
    }),

  subject: text("subject").notNull(),

  chapter: text("chapter").notNull(),

  topic: text("topic"),

  progressPercent: integer("progress_percent").default(0).notNull(),

  completed: boolean("completed").default(false).notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const studyLogs = pgTable("study_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  studentId: uuid("student_id")
    .notNull()
    .references(() => studentProfiles.id, {
      onDelete: "cascade",
    }),

  activityType: text("activity_type").notNull(),

  startTime: timestamp("start_time", {
    withTimezone: true,
  }).notNull(),

  endTime: timestamp("end_time", {
    withTimezone: true,
  }),

  durationMinutes: integer("duration_minutes"),

  logDate: date("log_date").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});