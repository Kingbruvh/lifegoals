"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  MapPin,
  Mail,
  Flag,
  GraduationCap,
  Activity,
  HeartHandshake,
  Check,
  Users,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Scope, dateLabel, progress, taskLabels } from "@/lib/model";
import {
  Avatar,
  Empty,
  Heading,
  Progress,
  SectionTitle,
  Stat,
  Tag,
} from "./ui";
import { RegionSelect } from "./dashboard";
export function People() {
  const { data, role } = useStore();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>(
    role === "regional" ? "Amsterdam" : "Alle regio’s",
  );
  const [filter, setFilter] = useState("Alle rollen");
  const people = data.people.filter(
    (p) =>
      p.roles.includes("Deelnemer") &&
      (scope === "Alle regio’s" || p.region === scope) &&
      (filter === "Alle rollen" || p.roles.includes(filter as "Coach")) &&
      `${p.name} ${p.email}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <Heading
        eyebrow="MENSEN MAKEN HET VERSCHIL"
        title="Iedereen in beeld"
        subtitle="Eén persoon, één verhaal. Ook als iemand meerdere rollen heeft."
      />
      <div className="list-toolbar">
        <label className="search">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek op naam of e-mailadres"
            aria-label="Zoek deelnemers"
          />
        </label>
        <div className="filters">
          <select
            aria-label="Filter op rol"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {["Alle rollen", "Deelnemer", "Coach", "Vrijwilliger"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <RegionSelect
            value={scope}
            onChange={setScope}
            regional={role === "regional"}
          />
        </div>
      </div>
      <section className="card flush">
        <div className="table-caption">
          <b>{people.length} deelnemers</b>
          <span>Verbonden door sport</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Naam</th>
                <th>Regio</th>
                <th>Rollen</th>
                <th>Opleiding</th>
                <th>Sportmomenten</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {people.map((p) => {
                const es = data.enrollments.filter((e) => e.personId === p.id);
                const attended = data.sessions.filter(
                  (s) => s.attendance[p.id] === "present",
                ).length;
                return (
                  <tr key={p.id}>
                    <td>
                      <Link
                        className="person-cell"
                        href={`/hub/deelnemers/${p.id}`}
                      >
                        <Avatar name={p.name} />
                        <span>
                          <b>{p.name}</b>
                          <small>{p.email}</small>
                        </span>
                      </Link>
                    </td>
                    <td>{p.region}</td>
                    <td>
                      <div className="tags">
                        {p.roles.map((r) => (
                          <Tag key={r} tone={r === "Coach" ? "green" : ""}>
                            {r}
                          </Tag>
                        ))}
                      </div>
                    </td>
                    <td>
                      {es.length ? (
                        <Progress
                          value={Math.round(
                            es.reduce((n, e) => n + progress(e), 0) / es.length,
                          )}
                          label={`${es.length} opleiding${es.length !== 1 ? "en" : ""}`}
                        />
                      ) : (
                        <span className="muted">Nog geen opleiding</span>
                      )}
                    </td>
                    <td>
                      <b>{attended}</b>
                      <span className="muted"> bijgewoond</span>
                    </td>
                    <td>
                      <Link
                        aria-label={`Profiel ${p.name}`}
                        href={`/hub/deelnemers/${p.id}`}
                      >
                        <ArrowUpRight size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!people.length && (
          <Empty title="Geen deelnemers gevonden">
            Probeer een andere naam of pas je filters aan.
          </Empty>
        )}
      </section>
    </>
  );
}
export function Journey({ personId }: { personId: string }) {
  const { data } = useStore();
  const p = data.people.find((p) => p.id === personId)!;
  const entries = [
    ...data.enrollments
      .filter((e) => e.personId === personId)
      .map((e) => ({
        id: e.id,
        date: e.date,
        title: "Een nieuw begin",
        detail: `Aangemeld voor ${data.courses.find((c) => c.id === e.courseId)!.title}`,
        kind: "course",
      })),
    ...data.sessions
      .filter((s) => s.attendance[personId] === "present")
      .map((s) => ({
        id: s.id,
        date: s.date,
        title: "Samen in beweging",
        detail: `${data.activities.find((a) => a.id === s.activityId)!.title} · ${data.activities.find((a) => a.id === s.activityId)!.location}`,
        kind: "activity",
      })),
    ...data.journey.filter((j) => j.personId === personId),
  ].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="journey">
      <div className="journey-intro">
        <Flag size={20} />
        <p>
          Geen grote sprongen nodig.
          <br />
          <b>Iedere stap is er één.</b>
        </p>
      </div>
      {entries.map((e, i) => (
        <div className={`journey-item ${i === 0 ? "latest" : ""}`} key={e.id}>
          <div className={`journey-icon ${e.kind}`}>
            {e.kind === "course" ? (
              <GraduationCap size={17} />
            ) : e.kind === "activity" ? (
              <Activity size={17} />
            ) : e.kind === "event" ? (
              <HeartHandshake size={17} />
            ) : (
              <Check size={17} />
            )}
          </div>
          <div>
            <span className="journey-date">{dateLabel(e.date)} 2026</span>
            <h3>{e.title}</h3>
            <p>{e.detail}</p>
            {i === 0 && <Tag tone="green">Meest recente stap</Tag>}
          </div>
        </div>
      ))}
      <div className="journey-item">
        <div className="journey-icon">
          <Flag size={17} />
        </div>
        <div>
          <span className="journey-date">{dateLabel(p.joined)} 2026</span>
          <h3>Welkom bij Life Goals</h3>
          <p>Hier begint het verhaal van {p.name.split(" ")[0]}.</p>
        </div>
      </div>
    </div>
  );
}
export function Profile({ id }: { id: string }) {
  const { data, role } = useStore();
  const [tab, setTab] = useState("De reis");
  const p = data.people.find((p) => p.id === id);
  if (!p || (role === "regional" && p.region !== "Amsterdam"))
    return <Empty title="Deelnemer niet beschikbaar" />;
  const es = data.enrollments.filter((e) => e.personId === id);
  const attended = data.sessions.filter((s) => s.attendance[id] === "present");
  const events = data.events.filter(
    (e) => e.volunteerIds.includes(id) || e.participantIds.includes(id),
  );
  return (
    <>
      <Link href="/hub/deelnemers" className="back-link">
        <ArrowLeft size={15} /> Alle deelnemers
      </Link>
      <div className="profile-hero">
        <Avatar name={p.name} size="large" />
        <div>
          <div className="eyebrow">
            ÉÉN PERSOON. EEN WERELD AAN MOGELIJKHEDEN.
          </div>
          <h1>{p.name}</h1>
          <div className="profile-meta">
            <span>
              <MapPin size={15} />
              {p.region}
            </span>
            <span>
              <Mail size={15} />
              {p.email}
            </span>
          </div>
          <div className="tags">
            {p.roles.map((r) => (
              <Tag tone="green" key={r}>
                {r}
              </Tag>
            ))}
          </div>
        </div>
        <Tag>Sinds {dateLabel(p.joined)} 2026</Tag>
      </div>
      <div className="profile-layout">
        <aside>
          <section className="card">
            <SectionTitle title="In beweging" />
            <div className="profile-numbers">
              <div>
                <b>{attended.length}</b>
                <span>sportmomenten</span>
              </div>
              <div>
                <b>{es.length}</b>
                <span>opleidingen</span>
              </div>
              <div>
                <b>{events.length}</b>
                <span>events</span>
              </div>
            </div>
          </section>
          <section className="card">
            <SectionTitle title="Leren & ontwikkelen" />
            {es.map((e) => (
              <Link
                className="profile-course"
                key={e.id}
                href={`/hub/opleidingen/${e.courseId}`}
              >
                <h3>{data.courses.find((c) => c.id === e.courseId)!.title}</h3>
                <p>{e.status}</p>
                <Progress value={progress(e)} />
              </Link>
            ))}
          </section>
          <section className="card">
            <SectionTitle title="Administratieve aandacht" />
            <p>
              {es.some((e) => e.tasks.some((t) => t === "missing"))
                ? "Er ontbreken nog onderdelen. Open de opleiding om samen de checklist bij te werken."
                : "Geen ontbrekende onderdelen. Open de opleiding voor alle statussen."}
            </p>
            <small className="muted">
              Fictieve statusregistratie · geen externe koppelingen.
            </small>
          </section>
        </aside>
        <section className="card">
          <div className="tabs">
            {["De reis", "Aanwezigheid", "Events & inzet"].map((t) => (
              <button
                key={t}
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "De reis" ? (
            <Journey personId={id} />
          ) : tab === "Aanwezigheid" ? (
            <div>
              {data.sessions
                .filter((s) => s.attendance[id])
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((s) => (
                  <div className="activity-row" key={s.id}>
                    <div className="date-tile">
                      <b>{s.date.slice(-2)}</b>
                      <small>{dateLabel(s.date).split(" ")[1]}</small>
                    </div>
                    <div>
                      <h3>
                        {
                          data.activities.find((a) => a.id === s.activityId)!
                            .title
                        }
                      </h3>
                      <p>{s.time}</p>
                    </div>
                    <Tag tone={s.attendance[id] === "present" ? "green" : ""}>
                      {s.attendance[id] === "present" ? "Aanwezig" : "Afwezig"}
                    </Tag>
                  </div>
                ))}
            </div>
          ) : (
            <div>
              {events.map((e) => (
                <div className="activity-row" key={e.id}>
                  <HeartHandshake size={24} />
                  <div>
                    <h3>{e.title}</h3>
                    <p>
                      {dateLabel(e.date)} · {e.region}
                    </p>
                  </div>
                  <Tag tone="green">
                    {e.volunteerIds.includes(id) ? "Vrijwilliger" : "Deelnemer"}
                  </Tag>
                </div>
              ))}
              {!events.length && (
                <Empty title="Ruimte voor een nieuwe ervaring">
                  Nog geen eventaanmeldingen.
                </Empty>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
