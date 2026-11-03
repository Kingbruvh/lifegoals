"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { useStore } from "@/lib/store";
import { Role, personas } from "@/lib/model";
import { Shell, Welcome } from "./shell";
import { Dashboard, Monitor, Regions, Future } from "./dashboard";
import { CourseList, CourseDetail, Registration } from "./courses";
import { People, Profile, Journey } from "./people";
import { Activities, ActivityDetail, CoachHome, Events } from "./activities";
import { PersonalHome, Portfolio, Discover } from "./personal";
import { Empty, Heading } from "./ui";
export default function App() {
  const path = usePathname();
  const s = useStore();
  const parts = path.split("/").filter(Boolean);
  if (!s.ready)
    return (
      <div className="loading-screen">
        <div className="loading-mark">LG</div>
        <p>Een moment, we zetten alles voor je klaar…</p>
      </div>
    );
  if (path === "/") return <Welcome />;
  if (parts[0] === "aanmelden")
    return <Registration courseId={parts[1] || ""} />;
  const required: Role | undefined =
    parts[0] === "opleider"
      ? "trainer"
      : parts[0] === "coach"
        ? "coach"
        : parts[0] === "mijn"
          ? "participant"
          : parts[0] === "hub" && parts[1] !== "toekomst"
            ? "national"
            : undefined;
  const accessible =
    !required ||
    s.role === required ||
    (required === "national" && s.role === "regional" && parts[1] !== "regios");
  let view;
  if (!accessible)
    view = (
      <div className="card access-card">
        <Heading
          title="Een ander perspectief"
          subtitle="Deze pagina hoort bij een andere demo-omgeving. Wissel van rol om verder te kijken."
        />
        <button className="button" onClick={() => s.setRole(required!)}>
          Bekijk als {personas.find((p) => p.id === required)!.title}
        </button>
      </div>
    );
  else if (path === "/hub") view = <Dashboard key={s.role} />;
  else if (path === "/hub/deelnemers") view = <People />;
  else if (parts[1] === "deelnemers" && parts[2])
    view = <Profile id={parts[2]} />;
  else if (path === "/hub/opleidingen") view = <CourseList />;
  else if (parts[1] === "opleidingen" && parts[2])
    view = <CourseDetail id={parts[2]} />;
  else if (path === "/hub/activiteiten") view = <Activities />;
  else if (parts[0] === "hub" && parts[1] === "activiteiten" && parts[2])
    view = <ActivityDetail id={parts[2]} />;
  else if (path === "/hub/events") view = <Events />;
  else if (path === "/hub/monitor") view = <Monitor key={s.role} />;
  else if (path === "/hub/regios") view = <Regions />;
  else if (path === "/hub/toekomst") view = <Future />;
  else if (path === "/opleider") view = <CourseList trainer />;
  else if (parts[0] === "opleider" && parts[1])
    view = <CourseDetail id={parts[1]} trainer />;
  else if (path === "/coach") view = <CoachHome />;
  else if (path === "/coach/activiteiten") view = <Activities coach />;
  else if (parts[0] === "coach" && parts[1] === "activiteiten" && parts[2])
    view = <ActivityDetail id={parts[2]} coach />;
  else if (path === "/coach/events") view = <Events personal coach />;
  else if (path === "/mijn") view = <PersonalHome />;
  else if (path === "/mijn/portfolio") view = <Portfolio />;
  else if (path === "/mijn/activiteiten") view = <Discover />;
  else if (path === "/mijn/activiteiten/events") view = <Events personal />;
  else if (path === "/mijn/reis")
    view = (
      <>
        <Heading
          eyebrow="JOUW VERHAAL"
          title="Kijk hoe ver je al bent."
          subtitle="De ontmoetingen, de ervaringen en de stappen die je hebt gezet."
        />
        <section className="card journey-page">
          <Journey personId={s.personId} />
        </section>
      </>
    );
  else
    view = (
      <Empty title="Deze pagina bestaat niet">
        <Link className="text-link" href="/">
          Terug naar het begin
        </Link>
      </Empty>
    );
  return (
    <MotionConfig reducedMotion="user">
      <Shell>
        <motion.div
          key={path}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          {view}
        </motion.div>
      </Shell>
    </MotionConfig>
  );
}
