"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  HeartHandshake,
  MapPin,
  Users,
  X,
  Minus,
  Activity as ActivityIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Scope, dateLabel } from "@/lib/model";
import { Avatar, Empty, Heading, SectionTitle, Stat, Tag } from "./ui";
import { RegionSelect } from "./dashboard";
export function Activities({ coach = false }: { coach?: boolean }) {
  const { data, role } = useStore();
  const [scope, setScope] = useState<Scope>(
    role === "regional" ? "Amsterdam" : "Alle regio’s",
  );
  const acts = data.activities.filter(
    (a) =>
      (!coach || a.coachId === "p1") &&
      (scope === "Alle regio’s" || a.region === scope),
  );
  return (
    <>
      <Heading
        eyebrow={coach ? "KLAAR VOOR HET VELD" : "ELKE WEEK EEN NIEUWE KANS"}
        title={coach ? "Mijn activiteiten" : "Samen in beweging"}
        subtitle={
          coach
            ? "Open een activiteit en registreer de aanwezigheid met één tik."
            : "Wekelijkse sportactiviteiten die mensen bij elkaar brengen."
        }
        action={
          !coach && (
            <RegionSelect
              value={scope}
              onChange={setScope}
              regional={role === "regional"}
            />
          )
        }
      />
      <div className="activity-grid">
        {acts.map((a, i) => (
          <Link
            className="card activity-card"
            href={`${coach ? "/coach" : "/hub"}/activiteiten/${a.id}`}
            key={a.id}
          >
            <div className={`sport-symbol sport-${i % 3}`}>
              <ActivityIcon size={30} />
              <span>{a.sport}</span>
            </div>
            <div className="activity-card-header">
              <Tag>{a.region}</Tag>
              <ArrowUpRight size={19} />
            </div>
            <h2>{a.title}</h2>
            <p>
              <MapPin size={15} />
              {a.location}
            </p>
            <p>
              <CalendarDays size={15} />
              {a.schedule}
            </p>
            <div className="activity-card-footer">
              <span>
                <Users size={16} />
                {a.participantIds.length} deelnemers
              </span>
              <Avatar
                name={data.people.find((p) => p.id === a.coachId)!.name}
                size="small"
              />
            </div>
          </Link>
        ))}
      </div>
      {!acts.length && <Empty />}
    </>
  );
}
export function ActivityDetail({
  id,
  coach = false,
}: {
  id: string;
  coach?: boolean;
}) {
  const s = useStore();
  const a = s.data.activities.find((a) => a.id === id);
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");
  if (
    !a ||
    (coach && a.coachId !== "p1") ||
    (s.role === "regional" && a.region !== "Amsterdam")
  )
    return <Empty title="Activiteit niet beschikbaar" />;
  const sessions = s.data.sessions
    .filter((s) => s.activityId === id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const session = sessions.find((s) => s.id === selected) || sessions[0];
  const people = s.data.people.filter((p) => a.participantIds.includes(p.id));
  const present = Object.values(session.attendance).filter(
    (v) => v === "present",
  ).length;
  const absent = Object.values(session.attendance).filter(
    (v) => v === "absent",
  ).length;
  return (
    <>
      <Link className="back-link" href={coach ? "/coach" : "/hub/activiteiten"}>
        <ArrowLeft size={15} /> {coach ? "Mijn overzicht" : "Alle activiteiten"}
      </Link>
      <Heading
        eyebrow={a.sport.toUpperCase()}
        title={a.title}
        subtitle={`${a.location} · ${a.region}`}
        action={<Tag tone="green">{a.schedule}</Tag>}
      />
      <section className="session-banner">
        <div>
          <CalendarDays size={23} />
          <label className="field">
            Bijeenkomst
            <select
              aria-label="Bijeenkomst"
              value={session.id}
              onChange={(e) => setSelected(e.target.value)}
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {dateLabel(s.date)} 2026 · {s.time}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <Avatar name={s.data.people.find((p) => p.id === a.coachId)!.name} />
          <span>
            <small>Jouw coach</small>
            <b>{s.data.people.find((p) => p.id === a.coachId)!.name}</b>
          </span>
        </div>
      </section>
      <div className="attendance-stats">
        <div>
          <span className="status-dot" />
          <b>{present}</b> aanwezig
        </div>
        <div>
          <b>{absent}</b> afwezig
        </div>
        <div>
          <b>{people.length - present - absent}</b> nog te registreren
        </div>
      </div>
      <section className="card attendance-card">
        <SectionTitle
          title="Wie is erbij?"
          subtitle="Tik op aanwezig of afwezig. Je wijziging wordt direct opgeslagen."
        />
        <input
          className="roster-search"
          aria-label="Zoek in deelnemerslijst"
          placeholder="Zoek een deelnemer…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="attendance-list">
          {people
            .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
            .map((p) => (
              <div className="attendance-row" key={p.id}>
                <Avatar name={p.name} />
                <div>
                  <h3>{p.name}</h3>
                  <small>
                    {session.attendance[p.id] === "present"
                      ? "Aanwezig"
                      : session.attendance[p.id] === "absent"
                        ? "Afwezig"
                        : "Nog niet geregistreerd"}
                  </small>
                </div>
                <div className="attendance-buttons">
                  <button
                    aria-label={`${p.name} aanwezig`}
                    aria-pressed={session.attendance[p.id] === "present"}
                    className={
                      session.attendance[p.id] === "present"
                        ? "present selected"
                        : ""
                    }
                    onClick={() => s.attendance(session.id, p.id, "present")}
                  >
                    <Check size={19} />
                    <span>Aanwezig</span>
                  </button>
                  <button
                    aria-label={`${p.name} afwezig`}
                    aria-pressed={session.attendance[p.id] === "absent"}
                    className={
                      session.attendance[p.id] === "absent"
                        ? "absent selected"
                        : ""
                    }
                    onClick={() => s.attendance(session.id, p.id, "absent")}
                  >
                    <X size={19} />
                    <span>Afwezig</span>
                  </button>
                  {session.attendance[p.id] && (
                    <button
                      className="clear-attendance"
                      aria-label={`${p.name} registratie wissen`}
                      onClick={() => s.attendance(session.id, p.id)}
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
        {!people.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        ).length && <Empty title="Geen deelnemers gevonden" />}
        <p className="fine">
          Aanwezigheid verschijnt ook in het deelnemersprofiel en de Life Goals
          Monitor.
        </p>
      </section>
    </>
  );
}
export function CoachHome() {
  const { data } = useStore();
  const acts = data.activities.filter((a) => a.coachId === "p1");
  const sessions = data.sessions
    .filter(
      (s) => acts.some((a) => a.id === s.activityId) && s.date >= "2026-11-03",
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  const first = sessions[0];
  const a = acts.find((a) => a.id === first?.activityId);
  return (
    <>
      <Heading
        eyebrow="DINSDAG 3 NOVEMBER · DEMOWEEK"
        title="Hé Milan, klaar voor vandaag?"
        subtitle="Jij brengt mensen bij elkaar. Wij houden het overzicht."
      />
      {a && (
        <section className="coach-feature">
          <Tag tone="cream">JOUW EERSTVOLGENDE ACTIVITEIT</Tag>
          <h2>{a.title}</h2>
          <p>
            <CalendarDays size={17} />
            {dateLabel(first.date)} · {first.time}–17:00
          </p>
          <p>
            <MapPin size={17} />
            {a.location}
          </p>
          <div>
            <span className="avatar-stack">
              {a.participantIds.slice(0, 4).map((id) => (
                <Avatar
                  name={data.people.find((p) => p.id === id)!.name}
                  key={id}
                />
              ))}
            </span>
            <span>{a.participantIds.length} mensen op de lijst</span>
          </div>
          <Link className="button" href={`/coach/activiteiten/${a.id}`}>
            Aanwezigheid registreren <ArrowUpRight size={18} />
          </Link>
          <div className="field-decoration" aria-hidden="true">
            <span />
            <span />
          </div>
        </section>
      )}
      <div className="two-columns">
        <section className="card">
          <SectionTitle
            title="Jouw week"
            href="/coach/activiteiten"
            label="Alle activiteiten"
          />
          {sessions.map((s) => {
            const a = acts.find((a) => a.id === s.activityId)!;
            return (
              <Link
                key={s.id}
                className="activity-row"
                href={`/coach/activiteiten/${a.id}`}
              >
                <div className="date-tile">
                  <b>{s.date.slice(-2)}</b>
                  <small>NOV</small>
                </div>
                <div>
                  <h3>{a.title}</h3>
                  <p>
                    {s.time} · {a.location}
                  </p>
                </div>
                <ArrowUpRight size={18} />
              </Link>
            );
          })}
        </section>
        <section className="card volunteer-teaser">
          <HeartHandshake size={28} />
          <h2>
            Ook naast het veld
            <br />
            maak jij het verschil.
          </h2>
          <p>
            Een extra paar handen, een warm welkom. Ontdek waar jij kunt
            meehelpen.
          </p>
          <Link href="/coach/events" className="text-link">
            Ontdek vrijwilligerskansen <ArrowRightIcon />
          </Link>
        </section>
      </div>
    </>
  );
}
function ArrowRightIcon() {
  return <ArrowUpRight size={17} />;
}
export function Events({
  personal = false,
  coach = false,
}: {
  personal?: boolean;
  coach?: boolean;
}) {
  const s = useStore();
  const pid = coach ? "p1" : s.personId;
  const events = s.data.events.filter(
    (e) => s.role !== "regional" || e.region === "Amsterdam",
  );
  return (
    <>
      <Heading
        eyebrow="MEEDOEN MAAKT HET VERSCHIL"
        title={
          personal ? "Samen iets moois neerzetten." : "Events & vrijwilligers"
        }
        subtitle={
          personal
            ? "Sport, ontmoet en help mee. Er is altijd een plek voor jou."
            : "Een ontmoeting op het veld. Een helpende hand ernaast."
        }
      />
      <div className="events-list">
        {events.map((e, i) => {
          const volunteer = e.volunteerIds.includes(pid);
          const joined = e.participantIds.includes(pid);
          return (
            <section className="card event-card" key={e.id}>
              <div className={`event-poster poster-${i}`}>
                <span>
                  LIFE GOALS
                  <br />
                  EVENTS
                </span>
                <HeartHandshake size={60} strokeWidth={1} />
                <b>
                  {dateLabel(e.date)}
                  <small>2026</small>
                </b>
              </div>
              <div className="event-content">
                <div className="tags">
                  <Tag>{e.region}</Tag>
                  <Tag tone="green">
                    {e.capacity - e.volunteerIds.length} vrijwilligersplekken
                  </Tag>
                </div>
                <h2>{e.title}</h2>
                <p>{e.description}</p>
                <div className="course-meta">
                  <span>
                    <MapPin size={16} />
                    {e.location}
                  </span>
                  <span>
                    <Users size={16} />
                    {e.participantIds.length} deelnemers ·{" "}
                    {e.volunteerIds.length} vrijwilligers
                  </span>
                </div>
                {personal ? (
                  <div className="event-actions">
                    <button
                      className={`button ${volunteer ? "success-button" : ""}`}
                      disabled={
                        volunteer || e.volunteerIds.length >= e.capacity
                      }
                      onClick={() => {
                        try {
                          s.joinEvent(e.id, pid, "volunteer");
                        } catch (err) {
                          s.notify((err as Error).message);
                        }
                      }}
                    >
                      {volunteer ? (
                        <>
                          <Check size={17} /> Je helpt mee
                        </>
                      ) : (
                        <>
                          <HeartHandshake size={17} /> Ik help mee
                        </>
                      )}
                    </button>
                    <button
                      className="button secondary"
                      disabled={joined}
                      onClick={() => s.joinEvent(e.id, pid, "participant")}
                    >
                      {joined ? "Je doet mee" : "Meedoen als deelnemer"}
                    </button>
                  </div>
                ) : (
                  <div className="volunteer-roster">
                    <h3>Vrijwilligers op de lijst</h3>
                    <div>
                      {e.volunteerIds.map((id) => {
                        const p = s.data.people.find((p) => p.id === id)!;
                        return (
                          <Link href={`/hub/deelnemers/${id}`} key={id}>
                            <Avatar name={p.name} size="small" />
                            {p.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
