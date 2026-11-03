export const regions = ["Amsterdam", "Utrecht", "Rotterdam"] as const;
export type Region = (typeof regions)[number];
export type Scope = Region | "Alle regio’s";
export type Role =
  "national" | "regional" | "trainer" | "coach" | "participant";
export type TaskStatus = "done" | "pending" | "missing" | "na";
export const taskLabels = [
  "Inschrijfgegevens",
  "Startdocument",
  "Digitale handtekening",
  "Kantar T0",
  "Kantar T1",
  "MDT / Verian",
  "Portfolio-opdracht",
  "Afronding opleiding",
];
export const statusLabels: Record<TaskStatus, string> = {
  done: "Afgerond",
  pending: "In behandeling",
  missing: "Ontbreekt",
  na: "Nog niet van toepassing",
};
export interface Person {
  id: string;
  name: string;
  email: string;
  region: Region;
  roles: ("Deelnemer" | "Coach" | "Vrijwilliger" | "Opleider")[];
  joined: string;
  eligible: boolean;
}
export interface Course {
  id: string;
  title: string;
  program: string;
  region: Region;
  start: string;
  end: string;
  trainerId: string;
  capacity: number;
  location: string;
  description: string;
  whatsapp?: string;
}
export interface Enrollment {
  id: string;
  personId: string;
  courseId: string;
  date: string;
  status: "Aangemeld" | "Deelnemend" | "Afgerond" | "Gestopt";
  tasks: TaskStatus[];
}
export interface Activity {
  id: string;
  title: string;
  sport: string;
  region: Region;
  location: string;
  coachId: string;
  schedule: string;
  participantIds: string[];
}
export interface Session {
  id: string;
  activityId: string;
  date: string;
  time: string;
  attendance: Record<string, "present" | "absent">;
}
export interface LifeEvent {
  id: string;
  title: string;
  region: Region;
  date: string;
  location: string;
  description: string;
  capacity: number;
  volunteerIds: string[];
  participantIds: string[];
}
export interface JourneyItem {
  id: string;
  personId: string;
  date: string;
  title: string;
  detail: string;
  kind: "course" | "activity" | "portfolio" | "event";
}
export interface DemoState {
  version: 1;
  people: Person[];
  courses: Course[];
  enrollments: Enrollment[];
  activities: Activity[];
  sessions: Session[];
  events: LifeEvent[];
  journey: JourneyItem[];
  monitoring: { personId: string; connected: boolean }[];
}
export const personas: {
  id: Role;
  name: string;
  title: string;
  subtitle: string;
  initials: string;
  path: string;
}[] = [
  {
    id: "national",
    name: "Noor de Vries",
    title: "Landelijk beheerder",
    subtitle: "Het hele netwerk in beeld",
    initials: "NV",
    path: "/hub",
  },
  {
    id: "regional",
    name: "Eva Bakker",
    title: "Regionale coördinator",
    subtitle: "Samen in beweging in Amsterdam",
    initials: "EB",
    path: "/hub",
  },
  {
    id: "trainer",
    name: "Robin van Dijk",
    title: "Opleider",
    subtitle: "Ruimte om te leren en te groeien",
    initials: "RD",
    path: "/opleider",
  },
  {
    id: "coach",
    name: "Milan de Groot",
    title: "Maatschappelijk Sportcoach",
    subtitle: "Meer tijd op het sportveld",
    initials: "MG",
    path: "/coach",
  },
  {
    id: "participant",
    name: "Samira El Amrani",
    title: "Deelnemer",
    subtitle: "Jouw volgende stap begint hier",
    initials: "SE",
    path: "/mijn",
  },
];
export function progress(e: Enrollment) {
  const applicable = e.tasks.filter((t) => t !== "na");
  return Math.round(
    (applicable.filter((t) => t === "done").length /
      Math.max(1, applicable.length)) *
      100,
  );
}
export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short" }).format(
    new Date(date + "T12:00:00"),
  );
export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .join("");
export function metrics(state: DemoState, scope: Scope) {
  const people = state.people.filter(
    (p) =>
      p.roles.includes("Deelnemer") &&
      (scope === "Alle regio’s" || p.region === scope),
  );
  const activities = state.activities.filter(
    (a) => scope === "Alle regio’s" || a.region === scope,
  );
  const courses = state.courses.filter(
    (c) => scope === "Alle regio’s" || c.region === scope,
  );
  const sessions = state.sessions.filter((s) =>
    activities.some((a) => a.id === s.activityId),
  );
  const enrollments = state.enrollments.filter((e) =>
    courses.some((c) => c.id === e.courseId),
  );
  const records = sessions.flatMap((s) => Object.values(s.attendance));
  const present = records.filter((s) => s === "present").length;
  const active = new Set(
    sessions.flatMap((s) =>
      Object.entries(s.attendance)
        .filter(([, a]) => a === "present")
        .map(([id]) => id),
    ),
  );
  return {
    people,
    activities,
    courses,
    sessions,
    enrollments,
    present,
    recorded: records.length,
    rate: records.length ? Math.round((present / records.length) * 100) : 0,
    active: people.filter((p) => active.has(p.id)).length,
    coaches: new Set(activities.map((a) => a.coachId)).size,
    ready: enrollments.filter((e) =>
      e.tasks.slice(0, 6).every((t) => t === "done" || t === "na"),
    ).length,
    completed: enrollments.filter((e) => e.status === "Afgerond").length,
  };
}
