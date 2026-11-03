"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  ChartNoAxesCombined,
  MapPin,
  HeartHandshake,
  ArrowUpRight,
  ChevronDown,
  Repeat2,
  Menu,
  X,
  RotateCcw,
  Compass,
  BookOpen,
  House,
  Flag,
  CircleHelp,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { personas, Role } from "@/lib/model";
import { Avatar, Logo, Modal, Tag } from "./ui";
const staffNav = [
  { label: "Overzicht", href: "/hub", icon: LayoutDashboard },
  { label: "Deelnemers", href: "/hub/deelnemers", icon: Users },
  { label: "Opleidingen", href: "/hub/opleidingen", icon: GraduationCap },
  { label: "Activiteiten", href: "/hub/activiteiten", icon: CalendarDays },
  {
    label: "Events & vrijwilligers",
    href: "/hub/events",
    icon: HeartHandshake,
  },
  {
    label: "Life Goals Monitor",
    href: "/hub/monitor",
    icon: ChartNoAxesCombined,
  },
  { label: "Regio’s", href: "/hub/regios", icon: MapPin },
];
export function Shell({ children }: { children: ReactNode }) {
  const s = useStore();
  const path = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [roles, setRoles] = useState(false);
  const [reset, setReset] = useState(false);
  const [help, setHelp] = useState(false);
  const persona = personas.find((p) => p.id === s.role)!;
  const person =
    s.data.people.find((p) => p.id === s.personId) || s.data.people[0];
  const name = s.role === "participant" ? person.name : persona.name;
  const nav =
    s.role === "national" || s.role === "regional"
      ? staffNav.filter(
          (n) => s.role === "national" || n.href !== "/hub/regios",
        )
      : s.role === "trainer"
        ? [
            {
              label: "Mijn opleidingen",
              href: "/opleider",
              icon: GraduationCap,
            },
          ]
        : s.role === "coach"
          ? [
              { label: "Mijn overzicht", href: "/coach", icon: House },
              {
                label: "Mijn activiteiten",
                href: "/coach/activiteiten",
                icon: CalendarDays,
              },
              {
                label: "Samen meehelpen",
                href: "/coach/events",
                icon: HeartHandshake,
              },
            ]
          : [
              { label: "Voor jou", href: "/mijn", icon: House },
              {
                label: "Mijn leerreis",
                href: "/mijn/portfolio",
                icon: BookOpen,
              },
              {
                label: "Ontdek & doe mee",
                href: "/mijn/activiteiten",
                icon: Compass,
              },
              { label: "Mijn momenten", href: "/mijn/reis", icon: Flag },
            ];
  const current = [...nav]
    .reverse()
    .find((n) => path === n.href || path.startsWith(n.href + "/"));
  function switchRole(role: Role) {
    s.setRole(role);
    setRoles(false);
    setMenu(false);
    router.push(personas.find((p) => p.id === role)!.path);
  }
  return (
    <div
      className={`app ${s.role === "participant" || s.role === "coach" ? "personal-app" : ""}`}
    >
      <a className="skip-link" href="#content">
        Naar de inhoud
      </a>
      {menu && (
        <button
          className="nav-overlay"
          aria-label="Menu sluiten"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <div className="sidebar-brand">
          <Logo />
          <button
            className="icon-button mobile-only"
            onClick={() => setMenu(false)}
            aria-label="Menu sluiten"
          >
            <X />
          </button>
        </div>
        <div className="workspace-label">
          <span className="workspace-mark">LG</span>
          <div>
            {s.role === "participant"
              ? "Mijn Life Goals"
              : s.role === "coach"
                ? "Coachomgeving"
                : s.role === "trainer"
                  ? "Life Goals Academie"
                  : "Life Goals Nederland"}
            <small>
              {s.role === "regional"
                ? "Regio Amsterdam"
                : "Samen maken we het verschil"}
            </small>
          </div>
        </div>
        <div className="nav-caption">WERKOMGEVING</div>
        <nav aria-label="Hoofdnavigatie">
          {nav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenu(false)}
              className={current?.href === href ? "active" : ""}
            >
              <Icon size={19} />
              <span>{label}</span>
              {current?.href === href && <span className="nav-active-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="status-dot" /> Eén netwerk. Meer perspectief.
            <p>Iedere stap telt. Samen brengen we mensen in beweging.</p>
            <Link href="/hub/toekomst" onClick={() => setMenu(false)}>
              De toekomst van Life Goals <ArrowUpRight size={14} />
            </Link>
          </div>
          <button className="quiet" onClick={() => setHelp(true)}>
            <CircleHelp size={17} /> Hulp bij de demo
          </button>
          <button className="quiet" onClick={() => setReset(true)}>
            <RotateCcw size={16} /> Reset demogegevens
          </button>
          <button className="profile-button" onClick={() => setRoles(true)}>
            <Avatar name={name} />
            <span>
              <b>{name}</b>
              <small>{persona.title}</small>
            </span>
            <Repeat2 size={17} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-only"
              aria-label="Menu openen"
              onClick={() => setMenu(true)}
            >
              <Menu />
            </button>
            <span>Life Goals</span>
            <span className="slash">/</span>
            <b>{current?.label || "Samen vooruit"}</b>
          </div>
          <div className="topbar-right">
            <span className="demo-label">
              <span /> Conceptdemo
            </span>
            <button className="role-trigger" onClick={() => setRoles(true)}>
              <Avatar name={name} size="small" />
              <span>{persona.title}</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>
        <main id="content">{children}</main>
        <footer>
          <span>Conceptdemo — alle gegevens zijn fictief.</span>
          <span>Met sport begint er meer.</span>
        </footer>
      </div>
      {roles && (
        <Modal
          title="Bekijk het door een andere bril"
          close={() => setRoles(false)}
        >
          <p className="muted">
            Dezelfde mensen. Dezelfde voortgang. Een omgeving die bij je past.
          </p>
          <div className="persona-list">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => switchRole(p.id)}
                className={s.role === p.id ? "selected" : ""}
              >
                <Avatar name={p.name} />
                <span>
                  <b>{p.title}</b>
                  <small>
                    {p.id === "regional"
                      ? "Eva Bakker · Amsterdam"
                      : p.id === "participant"
                        ? person.name
                        : p.name}
                  </small>
                </span>
                <ArrowUpRight size={18} />
              </button>
            ))}
          </div>
          <label className="field">
            Persoon in Mijn Life Goals
            <select
              value={s.personId}
              onChange={(e) => s.setPersonId(e.target.value)}
            >
              {s.data.people
                .filter((p) => p.roles.includes("Deelnemer"))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </label>
          <p className="fine">
            Rolwisseling is een simulatie. Er is geen echte aanmelding of
            beveiligde toegang.
          </p>
        </Modal>
      )}
      {reset && (
        <Modal title="Opnieuw beginnen?" close={() => setReset(false)}>
          <p>
            Alle wijzigingen in deze browser worden vervangen door de fictieve
            beginstand. De 36 deelnemers en hun oorspronkelijke activiteiten
            komen terug.
          </p>
          <div className="form-actions">
            <button
              className="button secondary"
              onClick={() => setReset(false)}
            >
              Annuleren
            </button>
            <button
              className="button"
              onClick={() => {
                s.reset();
                setReset(false);
                router.push(persona.path);
              }}
            >
              Reset demogegevens
            </button>
          </div>
        </Modal>
      )}
      {help && (
        <Modal title="Een rondje door Life Goals" close={() => setHelp(false)}>
          <ol className="guide-list">
            <li>Maak als coördinator een opleiding en open de aanmeldlink.</li>
            <li>Vink als opleider een portfolio-onderdeel af.</li>
            <li>Registreer als coach de aanwezigheid bij Samen voetballen.</li>
            <li>
              Bekijk als Samira je leerreis en meld je aan als vrijwilliger.
            </li>
            <li>Bekijk als landelijk beheerder de actuele Monitor.</li>
          </ol>
          <Tag>Alles wordt lokaal in deze browser bewaard</Tag>
          <p className="fine">
            Nieuw aangemaakte opleidingen en wijzigingen delen niet automatisch
            met andere apparaten. QR-codes openen de juiste URL; lokale
            demogegevens blijven in deze browser.
          </p>
        </Modal>
      )}
    </div>
  );
}
export function Welcome() {
  const s = useStore();
  const router = useRouter();
  return (
    <div className="welcome">
      <section className="welcome-story">
        <img
          className="welcome-photo"
          src="/sport.jpg"
          alt="Samen sporten op het veld tijdens een Life Goals activiteit"
        />
        <div className="welcome-shade" />
        <div className="welcome-brand">
          <Logo light />
          <Tag>HET DIGITALE ECOSYSTEEM</Tag>
        </div>
        <div className="welcome-copy">
          <div className="eyebrow">SPORT VOOR PERSPECTIEF</div>
          <h1>
            Elke stap vooruit.
            <br />
            <em>Samen verbonden.</em>
          </h1>
          <p>
            Van dat eerste moment op het veld tot zelf anderen in beweging
            brengen. Eén plek voor alles wat groeit.
          </p>
          <div className="welcome-line">
            <span>01 — ONTMOETEN</span>
            <span>02 — GROEIEN</span>
            <span>03 — MEEDOEN</span>
          </div>
        </div>
        <small className="photo-credit">
          Life Goals · beeld van stichtinglifegoals.nl
        </small>
      </section>
      <section className="welcome-choose">
        <div className="welcome-top">
          <span className="demo-label">
            <span /> Conceptdemo
          </span>
          <span>Life Goals Hub / 2026</span>
        </div>
        <div>
          <div className="eyebrow">WELKOM BIJ LIFE GOALS</div>
          <h2>
            Eén verhaal.
            <br />
            Vijf perspectieven.
          </h2>
          <p className="welcome-intro">
            Ervaar hoe een verbonden netwerk werkt.
            <br />
            Kies een rol en ontdek jouw omgeving.
          </p>
          <div className="persona-list welcome-personas">
            {personas.map((p, i) => (
              <button
                key={p.id}
                onClick={() => {
                  s.setRole(p.id);
                  router.push(p.path);
                }}
              >
                <span className={`persona-icon pi-${i}`}>
                  {i === 0 ? (
                    <LayoutDashboard />
                  ) : i === 1 ? (
                    <MapPin />
                  ) : i === 2 ? (
                    <GraduationCap />
                  ) : i === 3 ? (
                    <CalendarDays />
                  ) : (
                    <Compass />
                  )}
                </span>
                <span>
                  <b>
                    {p.title}
                    {p.id === "regional" && (
                      <small className="inline-region">Amsterdam</small>
                    )}
                  </b>
                  <small>{p.subtitle}</small>
                </span>
                <ArrowUpRight size={20} />
              </button>
            ))}
          </div>
        </div>
        <p className="fine">
          Conceptdemo — alle gegevens zijn fictief.
          <br />
          Je kunt op elk moment van rol wisselen.
        </p>
      </section>
    </div>
  );
}
