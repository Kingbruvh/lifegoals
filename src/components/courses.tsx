"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import {
  GraduationCap,
  Plus,
  ArrowUpRight,
  MapPin,
  CalendarDays,
  Users,
  Copy,
  Link as LinkIcon,
  Check,
  Clock,
  Minus,
  CircleAlert,
  ArrowLeft,
  FileCheck2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import {
  Course,
  Region,
  Scope,
  regions,
  progress,
  taskLabels,
  TaskStatus,
  statusLabels,
  dateLabel,
  Enrollment,
} from "@/lib/model";
import {
  Heading,
  Tag,
  Progress,
  Avatar,
  SectionTitle,
  Modal,
  Empty,
  Go,
  Logo,
} from "./ui";
import { RegionSelect } from "./dashboard";
export function CourseList({ trainer = false }: { trainer?: boolean }) {
  const s = useStore();
  const [create, setCreate] = useState(false);
  const [scope, setScope] = useState<Scope>(
    s.role === "regional" ? "Amsterdam" : "Alle regio’s",
  );
  const courses = s.data.courses.filter(
    (c) =>
      (!trainer || c.trainerId === "t0") &&
      (scope === "Alle regio’s" || c.region === scope),
  );
  return (
    <>
      <Heading
        eyebrow={trainer ? "LIFE GOALS ACADEMIE" : "RUIMTE OM TE GROEIEN"}
        title={trainer ? "Goedemorgen, Robin" : "Opleidingen"}
        subtitle={
          trainer
            ? "Iedere deelnemer leert op zijn eigen tempo. Zo help jij de volgende stap mogelijk maken."
            : "Van eerste aanmelding tot een volgende stap op het veld."
        }
        action={
          !trainer && (
            <button className="button" onClick={() => setCreate(true)}>
              <Plus size={18} /> Nieuwe opleiding
            </button>
          )
        }
      />
      <div className="list-toolbar">
        <div className="tabs">
          <span className="active">
            {trainer ? "Mijn opleidingen" : "Alle opleidingen"}{" "}
            <b>{courses.length}</b>
          </span>
        </div>
        {!trainer && (
          <RegionSelect
            value={scope}
            onChange={setScope}
            regional={s.role === "regional"}
          />
        )}
      </div>
      <div className="course-grid">
        {courses.map((c, i) => {
          const es = s.data.enrollments.filter((e) => e.courseId === c.id);
          return (
            <Link
              href={trainer ? `/opleider/${c.id}` : `/hub/opleidingen/${c.id}`}
              className="course-card"
              key={c.id}
            >
              <div className={`course-card-top course-tone-${i % 3}`}>
                <span>LIFE GOALS ACADEMIE</span>
                <GraduationCap size={44} strokeWidth={1.3} />
                <Tag>{c.region}</Tag>
              </div>
              <div className="course-card-content">
                <div className="course-status">
                  <span className="status-dot" />
                  {c.start > "2026-11-03"
                    ? "Binnenkort van start"
                    : "In uitvoering"}
                  <ArrowUpRight size={18} />
                </div>
                <h2>{c.title}</h2>
                <p>{c.description}</p>
                <div className="course-meta">
                  <span>
                    <CalendarDays size={15} />
                    {dateLabel(c.start)} – {dateLabel(c.end)}
                  </span>
                  <span>
                    <Users size={15} />
                    {es.filter((e) => e.status !== "Gestopt").length} /{" "}
                    {c.capacity} deelnemers
                  </span>
                </div>
                <Progress
                  value={
                    es.length
                      ? Math.round(
                          es.reduce((sum, e) => sum + progress(e), 0) /
                            es.length,
                        )
                      : 0
                  }
                  label="Gemiddelde voortgang"
                />
                <div className="course-trainer">
                  <Avatar
                    name={
                      s.data.people.find((p) => p.id === c.trainerId)?.name ||
                      "Opleider"
                    }
                    size="small"
                  />
                  <span>
                    {s.data.people.find((p) => p.id === c.trainerId)?.name}
                  </span>
                  <span>Opleider</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {!courses.length && (
        <Empty title="Hier begint iets nieuws">
          Maak de eerste opleiding voor deze regio.
        </Empty>
      )}
      {create && <CourseForm close={() => setCreate(false)} />}
    </>
  );
}
function CourseForm({ close }: { close: () => void }) {
  const s = useStore();
  const router = useRouter();
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const whatsapp = String(f.get("whatsapp") || "").trim();
    if (
      whatsapp &&
      !/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/.test(whatsapp)
    ) {
      setError(
        "Gebruik een geldige https://chat.whatsapp.com/ uitnodigingslink.",
      );
      return;
    }
    try {
      const id = s.addCourse({
        title: String(f.get("title")),
        program: String(f.get("program")),
        region: String(f.get("region")) as Region,
        start: String(f.get("start")),
        end: String(f.get("end")),
        trainerId: String(f.get("trainer")),
        capacity: Number(f.get("capacity")),
        location: String(f.get("location")),
        description: String(f.get("description")),
        whatsapp,
      });
      close();
      router.push(`/hub/opleidingen/${id}`);
    } catch (err) {
      setError((err as Error).message);
    }
  }
  return (
    <Modal title="Een nieuwe opleiding" close={close}>
      <p className="muted">Geef een nieuwe groep ruimte om te groeien.</p>
      <form onSubmit={submit} className="form-grid">
        <label className="field full">
          Titel van de opleiding
          <input
            name="title"
            required
            placeholder="Bijvoorbeeld: MDT Amsterdam — wintergroep"
            maxLength={90}
          />
        </label>
        <label className="field">
          Programma
          <select name="program">
            <option>MDT Set Your Life Goals</option>
            <option>Maatschappelijk Sportcoach</option>
            <option>Life Goals Academie</option>
          </select>
        </label>
        <label className="field">
          Regio
          <select name="region">
            {(s.role === "regional" ? ["Amsterdam"] : regions).map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Startdatum
          <input type="date" name="start" required defaultValue="2026-11-16" />
        </label>
        <label className="field">
          Einddatum
          <input type="date" name="end" required defaultValue="2026-12-18" />
        </label>
        <label className="field">
          Opleider
          <select name="trainer">
            {s.data.people
              .filter((p) => p.roles.includes("Opleider"))
              .map((p) => (
                <option value={p.id} key={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </label>
        <label className="field">
          Aantal plekken
          <input
            type="number"
            name="capacity"
            required
            min="1"
            max="200"
            defaultValue="16"
          />
        </label>
        <label className="field full">
          Locatie
          <input
            name="location"
            required
            placeholder="Sportcentrum of ontmoetingsplek"
          />
        </label>
        <label className="field full">
          Beschrijving
          <textarea
            name="description"
            required
            placeholder="Wat gaan jullie samen doen?"
            rows={3}
          />
        </label>
        <label className="field full">
          WhatsApp-uitnodiging <small>optioneel</small>
          <input
            name="whatsapp"
            type="url"
            placeholder="https://chat.whatsapp.com/…"
          />
        </label>
        {error && (
          <p className="error full" role="alert">
            {error}
          </p>
        )}
        <div className="form-actions full">
          <button type="button" className="button secondary" onClick={close}>
            Annuleren
          </button>
          <button className="button" type="submit">
            <Plus size={17} /> Opleiding aanmaken
          </button>
        </div>
      </form>
    </Modal>
  );
}
export function CourseDetail({
  id,
  trainer = false,
}: {
  id: string;
  trainer?: boolean;
}) {
  const s = useStore();
  const c = s.data.courses.find((c) => c.id === id);
  const [tab, setTab] = useState("Deelnemers");
  const [qr, setQr] = useState("");
  const [url, setUrl] = useState("");
  const [person, setPerson] = useState("");
  useEffect(() => {
    const link = `${location.origin}/aanmelden/${id}`;
    setUrl(link);
    QRCode.toDataURL(link, {
      width: 220,
      margin: 2,
      color: { dark: "#252525", light: "#ffffff" },
    })
      .then(setQr)
      .catch(() =>
        s.notify("QR-code kon niet worden geladen. De aanmeldlink werkt wel."),
      );
  }, [id]);
  if (
    !c ||
    (trainer && c.trainerId !== "t0") ||
    (s.role === "regional" && c.region !== "Amsterdam")
  )
    return (
      <Empty title="Opleiding niet beschikbaar">
        Kies een opleiding uit je eigen overzicht.
      </Empty>
    );
  const es = s.data.enrollments.filter((e) => e.courseId === id);
  const selected = es.find((e) => e.personId === person);
  const avg = es.length
    ? Math.round(es.reduce((n, e) => n + progress(e), 0) / es.length)
    : 0;
  return (
    <>
      <Link
        className="back-link"
        href={trainer ? "/opleider" : "/hub/opleidingen"}
      >
        <ArrowLeft size={15} /> Alle opleidingen
      </Link>
      <Heading
        eyebrow={c.program.toUpperCase()}
        title={c.title}
        subtitle={`${c.region} · ${c.location}`}
        action={
          <Tag tone="green">
            {dateLabel(c.start)} – {dateLabel(c.end)}
          </Tag>
        }
      />
      <div className="course-detail-grid">
        <section className="card course-detail-intro">
          <GraduationCap size={29} />
          <h2>Een volgende stap, samen.</h2>
          <p>{c.description}</p>
          <div className="inline-facts">
            <span>
              <Users size={17} />
              {es.length} / {c.capacity} deelnemers
            </span>
            <span>
              <Avatar
                name={s.data.people.find((p) => p.id === c.trainerId)!.name}
                size="small"
              />
              {s.data.people.find((p) => p.id === c.trainerId)!.name}
            </span>
          </div>
          <Progress value={avg} label="Gemiddelde checklistvoortgang" />
          {c.whatsapp && (
            <a
              className="text-link"
              style={{ marginTop: 16 }}
              href={c.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp-groepsuitnodiging (extern) <ArrowUpRight size={15} />
            </a>
          )}
        </section>
        <section className="card registration-card">
          <div>
            <span className="eyebrow">DE DEUR STAAT OPEN</span>
            <h2>Nodig deelnemers uit</h2>
            <p>Scan de code of open de aanmeldpagina.</p>
            <Link className="text-link" href={`/aanmelden/${id}`}>
              <LinkIcon size={15} /> Aanmeldpagina openen{" "}
              <ArrowUpRight size={16} />
            </Link>
            <button
              className="quiet"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(url);
                  s.notify("Aanmeldlink gekopieerd.");
                } catch {
                  s.notify("Kopieer de link uit het veld hieronder.");
                }
              }}
            >
              <Copy size={15} /> Link kopiëren
            </button>
          </div>
          {qr && (
            <img
              src={qr}
              alt="QR-code naar de aanmeldpagina"
              width={130}
              height={130}
            />
          )}
          <input
            className="share-url"
            aria-label="Aanmeldlink"
            value={url}
            readOnly
            onFocus={(e) => e.target.select()}
          />
          <small>Demogegevens worden alleen in deze browser gedeeld.</small>
        </section>
      </div>
      <div className="tabs detail-tabs">
        {["Deelnemers", "Voortgangsmatrix", "Bijeenkomsten"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
            {t === "Deelnemers" && <b>{es.length}</b>}
          </button>
        ))}
      </div>
      <section className="card flush">
        {tab === "Deelnemers" ? (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Deelnemer</th>
                    <th>Status</th>
                    <th>Sportmomenten</th>
                    <th>Voortgang</th>
                    <th>Aangemeld</th>
                    <th>Portfolio</th>
                  </tr>
                </thead>
                <tbody>
                  {es.map((e) => {
                    const p = s.data.people.find((p) => p.id === e.personId)!;
                    return (
                      <tr key={e.id}>
                        <td>
                          <div className="person-cell">
                            <Avatar name={p.name} />
                            <span>
                              <b>{p.name}</b>
                              <small>{p.region}</small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <select
                            aria-label={`Inschrijfstatus ${p.name}`}
                            value={e.status}
                            onChange={(ev) =>
                              s.setEnrollment(
                                e.id,
                                ev.target.value as Enrollment["status"],
                              )
                            }
                          >
                            {[
                              "Aangemeld",
                              "Deelnemend",
                              "Afgerond",
                              "Gestopt",
                            ].map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <b>
                            {
                              s.data.sessions.filter(
                                (session) =>
                                  session.attendance[p.id] === "present",
                              ).length
                            }
                          </b>{" "}
                          <small>bijgewoond</small>
                        </td>
                        <td>
                          <Progress value={progress(e)} />
                        </td>
                        <td>{dateLabel(e.date)}</td>
                        <td>
                          <button
                            className="text-link"
                            onClick={() => setPerson(p.id)}
                          >
                            Bekijk portfolio <ArrowUpRight size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!es.length && (
              <Empty title="Wie zet de eerste stap?">
                Deel de aanmeldlink. Een nieuwe inschrijving verschijnt hier
                meteen.
              </Empty>
            )}
          </>
        ) : tab === "Voortgangsmatrix" ? (
          <>
            <div className="matrix-legend">
              <span>
                <Check size={14} /> Afgerond
              </span>
              <span>
                <Clock size={14} /> In behandeling
              </span>
              <span>
                <CircleAlert size={14} /> Ontbreekt
              </span>
              <span>
                <Minus size={14} /> Nog niet van toepassing
              </span>
            </div>
            <div className="table-scroll">
              <table className="matrix">
                <thead>
                  <tr>
                    <th>Deelnemer</th>
                    {taskLabels.map((t) => (
                      <th key={t}>{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {es.map((e) => {
                    const p = s.data.people.find((p) => p.id === e.personId)!;
                    return (
                      <tr key={e.id}>
                        <td>
                          <button
                            className="text-link"
                            onClick={() => setPerson(p.id)}
                          >
                            {p.name}
                          </button>
                        </td>
                        {e.tasks.map((t, i) => (
                          <td key={i}>
                            <button
                              className={`status-cell ${t}`}
                              title={`${p.name}: ${taskLabels[i]} — ${statusLabels[t]}. Klik om te wijzigen.`}
                              aria-label={`${p.name}: ${taskLabels[i]} — ${statusLabels[t]}`}
                              onClick={() =>
                                s.setTask(
                                  e.id,
                                  i,
                                  t === "done" ? "pending" : "done",
                                )
                              }
                            >
                              {t === "done" ? (
                                <Check size={17} />
                              ) : t === "missing" ? (
                                <CircleAlert size={17} />
                              ) : t === "na" ? (
                                <Minus size={17} />
                              ) : (
                                <Clock size={17} />
                              )}
                            </button>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="fine padded">
              Klik op een status om dit demo-onderdeel af te ronden of te
              heropenen. Geen externe vragenlijsten of digitale ondertekening.
            </p>
          </>
        ) : (
          <div className="padded">
            {[
              "Kennismaken & jouw doelen",
              "Samen een activiteit begeleiden",
              "Terugkijken & volgende stappen",
            ].map((t, i) => (
              <div className="activity-row" key={t}>
                <div className="date-tile">
                  <b>0{i + 1}</b>
                  <small>SESSIE</small>
                </div>
                <div>
                  <h3>{t}</h3>
                  <p>
                    {i === 0
                      ? dateLabel(c.start)
                      : i === 2
                        ? dateLabel(c.end)
                        : "Tijdens de opleiding"}{" "}
                    · {c.location}
                  </p>
                </div>
                <Tag>Voorbeeldbijeenkomst</Tag>
              </div>
            ))}
            <p className="fine">
              Sportaanwezigheid van deze deelnemers staat in hun profiel. Deze
              opleidingsbijeenkomsten zijn illustratieve planningsonderdelen.
            </p>
          </div>
        )}
      </section>
      {selected && (
        <Modal
          title={`Portfolio · ${s.data.people.find((p) => p.id === person)!.name}`}
          close={() => setPerson("")}
        >
          <TaskChecklist enrollment={selected} editable />
          <div className="form-actions">
            <button className="button secondary" onClick={() => setPerson("")}>
              Sluiten
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
export function TaskChecklist({
  enrollment,
  editable = false,
}: {
  enrollment: Enrollment;
  editable?: boolean;
}) {
  const s = useStore();
  return (
    <>
      <Progress value={progress(enrollment)} label="Jouw voortgang" />
      <div className="checklist">
        {taskLabels.map((t, i) => (
          <div className="checklist-row" key={t}>
            <span className={`status-cell ${enrollment.tasks[i]}`}>
              {enrollment.tasks[i] === "done" ? (
                <Check size={18} />
              ) : enrollment.tasks[i] === "missing" ? (
                <CircleAlert size={18} />
              ) : enrollment.tasks[i] === "na" ? (
                <Minus size={18} />
              ) : (
                <Clock size={18} />
              )}
            </span>
            <div>
              <h3>{t}</h3>
              <small>
                {i === 6
                  ? "Mijn talenten en een activiteit voorbereiden"
                  : [2, 3, 4, 5].includes(i)
                    ? "Alleen een demostatus · geen externe koppeling"
                    : "Onderdeel van jouw opleiding"}
              </small>
            </div>
            {editable ? (
              <select
                aria-label={`Status ${t}`}
                value={enrollment.tasks[i]}
                onChange={(e) =>
                  s.setTask(enrollment.id, i, e.target.value as TaskStatus)
                }
              >
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            ) : (
              <Tag tone={enrollment.tasks[i] === "done" ? "green" : ""}>
                {statusLabels[enrollment.tasks[i]]}
              </Tag>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
export function Registration({ courseId }: { courseId: string }) {
  const s = useStore();
  const router = useRouter();
  const c = s.data.courses.find((c) => c.id === courseId);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existing, setExisting] = useState(s.personId);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p = s.data.people.find((p) => p.id === existing);
    try {
      const pid = s.enroll(
        courseId,
        p?.name || String(f.get("name")),
        p?.email || String(f.get("email")),
        p?.id,
      );
      setSuccess(pid);
    } catch (err) {
      setError((err as Error).message);
    }
  }
  return (
    <div className="registration-page">
      <header>
        <Logo />
        <Link href="/hub/opleidingen" className="text-link">
          <ArrowLeft size={15} /> Terug naar opleidingen
        </Link>
      </header>
      {!c ? (
        <section className="registration-box">
          <Empty title="Deze opleiding staat niet in deze browser">
            Open de link in de browser waarin de opleiding is gemaakt. Nieuwe
            demogegevens worden niet tussen apparaten gedeeld.
          </Empty>
          <Go href="/">Naar het begin</Go>
        </section>
      ) : success ? (
        <section className="registration-box success-page">
          <span className="success-circle">
            <Check size={32} />
          </span>
          <div className="eyebrow">JOUW VOLGENDE STAP</div>
          <h1>Je staat op de lijst!</h1>
          <p>
            Welkom bij {c.title}. We kijken ernaar uit om samen in beweging te
            komen.
          </p>
          <button
            className="button"
            onClick={() => {
              s.setPersonId(success);
              s.setRole("participant");
              router.push("/mijn");
            }}
          >
            Naar Mijn Life Goals <ArrowUpRight size={18} />
          </button>
          <Link
            href={`/hub/opleidingen/${c.id}`}
            className="text-link"
            onClick={() =>
              s.setRole(c.region === "Amsterdam" ? "regional" : "national")
            }
          >
            Terug naar de coördinator
          </Link>
          <p className="fine">
            Demo-aanmelding opgeslagen in deze browser. Er is geen e-mail
            verstuurd.
          </p>
        </section>
      ) : (
        <div className="registration-layout">
          <section className="registration-story">
            <Tag>JOUW TALENT MAAKT HET VERSCHIL</Tag>
            <h1>
              Er zit meer
              <br />
              in je dan
              <br />
              <em>je denkt.</em>
            </h1>
            <p>{c.description}</p>
            <img src="/sport.jpg" alt="Sporten en ontmoeten bij Life Goals" />
            <div>
              <h2>{c.title}</h2>
              <p>
                <MapPin size={16} /> {c.location} · {c.region}
              </p>
              <p>
                <CalendarDays size={16} /> {dateLabel(c.start)} –{" "}
                {dateLabel(c.end)}
              </p>
            </div>
          </section>
          <section className="registration-box">
            <div className="eyebrow">LEUK DAT JE MEE WILT DOEN</div>
            <h2>Zet de eerste stap.</h2>
            <p>Een paar gegevens, en je bent erbij.</p>
            <form onSubmit={submit}>
              <label className="field">
                Kies een demodeelnemer
                <select
                  value={existing}
                  onChange={(e) => {
                    setExisting(e.target.value);
                    setError("");
                  }}
                >
                  <option value="">Nieuwe fictieve deelnemer</option>
                  {s.data.people
                    .filter((p) => p.roles.includes("Deelnemer"))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </label>
              {!existing && (
                <>
                  <label className="field">
                    Fictieve naam
                    <input
                      name="name"
                      required
                      placeholder="Bijvoorbeeld: Alex Voorbeeld"
                    />
                  </label>
                  <label className="field">
                    Fictief e-mailadres
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="alex@example.invalid"
                      pattern=".+@example\.invalid"
                    />
                    <small>Gebruik uitsluitend @example.invalid.</small>
                  </label>
                </>
              )}
              <label className="checkbox-label">
                <input type="checkbox" required />
                Ik begrijp dat dit een demo met fictieve gegevens is.
              </label>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button className="button" type="submit">
                Ik doe mee <ArrowUpRight size={18} />
              </button>
              <p className="fine">
                Geen echte inschrijving, e-mail of externe gegevensverwerking.
              </p>
            </form>
          </section>
        </div>
      )}
      <footer>Conceptdemo — alle gegevens zijn fictief.</footer>
    </div>
  );
}
