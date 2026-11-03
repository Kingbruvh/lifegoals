"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Course, DemoState, Role, TaskStatus, Enrollment } from "./model";
import { createSeed } from "./seed";
const KEY = "life-goals-demo-v1";
const id = () => crypto.randomUUID();
const today = () => new Date().toISOString().slice(0, 10);
interface Store {
  data: DemoState;
  role: Role;
  personId: string;
  ready: boolean;
  notice: string;
  setRole: (r: Role) => void;
  setPersonId: (id: string) => void;
  notify: (s: string) => void;
  reset: () => void;
  addCourse: (c: Omit<Course, "id">) => string;
  enroll: (
    courseId: string,
    name: string,
    email: string,
    existingId?: string,
  ) => string;
  setTask: (enrollmentId: string, index: number, status: TaskStatus) => void;
  setEnrollment: (id: string, status: Enrollment["status"]) => void;
  attendance: (
    sessionId: string,
    personId: string,
    status?: "present" | "absent",
  ) => void;
  joinActivity: (activityId: string, personId: string) => void;
  joinEvent: (
    eventId: string,
    personId: string,
    capacity: "volunteer" | "participant",
  ) => void;
}
const Context = createContext<Store | null>(null);
export function Provider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoState>(createSeed);
  const ref = useRef(data);
  const [role, setRole] = useState<Role>("national");
  const [personId, setPersonId] = useState("p0");
  const [ready, setReady] = useState(false);
  const [notice, notify] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (valid(parsed)) {
          ref.current = parsed;
          setData(parsed);
        } else notify("Oude demogegevens zijn vervangen door de beginstand.");
      }
      const r = localStorage.getItem(KEY + "-role");
      if (
        r &&
        ["national", "regional", "trainer", "coach", "participant"].includes(r)
      )
        setRole(r as Role);
      const p = localStorage.getItem(KEY + "-person");
      if (p && ref.current.people.some((x) => x.id === p)) setPersonId(p);
    } catch {
      notify(
        "Opslaan is niet beschikbaar. Je kunt de demo wel in dit venster gebruiken.",
      );
    }
    setReady(true);
    const sync = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try {
          const d = JSON.parse(e.newValue);
          if (valid(d)) {
            ref.current = d;
            setData(d);
          }
        } catch {
          /* retain valid in-memory data */
        }
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => notify(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  function commit(fn: (draft: DemoState) => void) {
    const draft = structuredClone(ref.current);
    fn(draft);
    ref.current = draft;
    setData(draft);
    try {
      localStorage.setItem(KEY, JSON.stringify(draft));
    } catch {
      notify(
        "Wijziging bewaard in dit venster. Browseropslag is niet beschikbaar.",
      );
    }
  }
  function persist(key: string, value: string) {
    try {
      localStorage.setItem(KEY + key, value);
    } catch {
      /* memory mode */
    }
  }
  const store: Store = {
    data,
    role,
    personId,
    ready,
    notice,
    notify,
    setRole: (r) => {
      setRole(r);
      persist("-role", r);
    },
    setPersonId: (p) => {
      setPersonId(p);
      persist("-person", p);
    },
    reset: () => {
      const seed = createSeed();
      commit((d) => Object.assign(d, seed));
      setPersonId("p0");
      persist("-person", "p0");
      notify("De demo staat weer op de beginstand.");
    },
    addCourse: (c) => {
      if (
        !c.title.trim() ||
        !c.location.trim() ||
        c.end < c.start ||
        c.capacity < 1
      )
        throw new Error("Controleer de titel, locatie, data en capaciteit.");
      const courseId = id();
      commit((d) => d.courses.push({ ...c, id: courseId }));
      notify("Opleiding aangemaakt. Klaar voor de eerste aanmelding!");
      return courseId;
    },
    enroll: (courseId, name, email, existingId) => {
      const d = ref.current;
      const c = d.courses.find((c) => c.id === courseId);
      if (!c) throw new Error("Deze opleiding bestaat niet in deze browser.");
      let pid =
        existingId ||
        d.people.find((p) => p.email.toLowerCase() === email.toLowerCase())?.id;
      if (
        pid &&
        d.enrollments.some((e) => e.personId === pid && e.courseId === courseId)
      )
        throw new Error("Je bent al aangemeld voor deze opleiding.");
      if (
        d.enrollments.filter(
          (e) => e.courseId === courseId && e.status !== "Gestopt",
        ).length >= c.capacity
      )
        throw new Error("Deze opleiding zit vol. Kies een andere opleiding.");
      if (!name.trim() || !email.endsWith("@example.invalid"))
        throw new Error(
          "Gebruik een fictieve naam en een e-mailadres op @example.invalid.",
        );
      pid ||= id();
      const person = pid;
      commit((next) => {
        if (!next.people.some((p) => p.id === person))
          next.people.push({
            id: person,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            region: c.region,
            roles: ["Deelnemer"],
            joined: today(),
            eligible: true,
          });
        next.enrollments.push({
          id: id(),
          personId: person,
          courseId,
          date: today(),
          status: "Aangemeld",
          tasks: [
            "done",
            "missing",
            "pending",
            "pending",
            "na",
            "pending",
            "pending",
            "na",
          ],
        });
      });
      notify("Je aanmelding is gelukt. Welkom bij Life Goals!");
      return person;
    },
    setTask: (eid, index, status) => {
      commit((d) => {
        const e = d.enrollments.find((e) => e.id === eid);
        if (!e) return;
        e.tasks[index] = status;
        if (index === 7)
          e.status = status === "done" ? "Afgerond" : "Deelnemend";
        d.journey.push({
          id: id(),
          personId: e.personId,
          date: today(),
          title:
            status === "done"
              ? "Een nieuwe stap afgerond"
              : "Voortgang bijgewerkt",
          detail: d.courses.find((c) => c.id === e.courseId)!.title,
          kind: "portfolio",
        });
      });
      notify("Voortgang bijgewerkt in alle omgevingen.");
    },
    setEnrollment: (eid, status) => {
      commit((d) => {
        const e = d.enrollments.find((e) => e.id === eid);
        if (e) {
          e.status = status;
          e.tasks[7] = status === "Afgerond" ? "done" : "na";
        }
      });
      notify("Inschrijfstatus bijgewerkt.");
    },
    attendance: (sid, pid, status) => {
      commit((d) => {
        const session = d.sessions.find((s) => s.id === sid);
        if (session) {
          if (status) session.attendance[pid] = status;
          else delete session.attendance[pid];
        }
      });
      notify("Aanwezigheid opgeslagen.");
    },
    joinActivity: (aid, pid) => {
      commit((d) => {
        const a = d.activities.find((a) => a.id === aid);
        if (a && !a.participantIds.includes(pid)) a.participantIds.push(pid);
      });
      notify("Je doet mee! Je staat op de deelnemerslijst.");
    },
    joinEvent: (eid, pid, capacity) => {
      const event = ref.current.events.find((e) => e.id === eid);
      const person = ref.current.people.find((p) => p.id === pid);
      if (!event || !person) return;
      if (capacity === "volunteer" && !person.eligible)
        throw new Error(
          "Voor deze vrijwilligerstaak ben je nog niet aangemeld als beschikbaar.",
        );
      if (
        capacity === "volunteer" &&
        event.volunteerIds.length >= event.capacity &&
        !event.volunteerIds.includes(pid)
      )
        throw new Error("Alle vrijwilligersplekken zijn gevuld.");
      commit((d) => {
        const e = d.events.find((e) => e.id === eid)!;
        const ids =
          capacity === "volunteer" ? e.volunteerIds : e.participantIds;
        if (!ids.includes(pid)) {
          ids.push(pid);
          const p = d.people.find((p) => p.id === pid)!;
          if (capacity === "volunteer" && !p.roles.includes("Vrijwilliger"))
            p.roles.push("Vrijwilliger");
          d.journey.push({
            id: id(),
            personId: pid,
            date: today(),
            title:
              capacity === "volunteer"
                ? "Aangemeld als vrijwilliger"
                : "Aangemeld voor een event",
            detail: e.title,
            kind: "event",
          });
        }
      });
      notify(
        capacity === "volunteer"
          ? "Wat fijn dat je meehelpt! Je bent aangemeld."
          : "Je bent aangemeld voor het event.",
      );
    },
  };
  return (
    <Context.Provider value={store}>
      {children}
      <div
        className={`toast ${notice ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>
    </Context.Provider>
  );
}
function valid(d: DemoState) {
  return (
    d?.version === 1 &&
    [
      "people",
      "courses",
      "enrollments",
      "activities",
      "sessions",
      "events",
      "journey",
      "monitoring",
    ].every((k) => Array.isArray(d[k as keyof DemoState]))
  );
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw new Error("Store provider ontbreekt");
  return store;
}
