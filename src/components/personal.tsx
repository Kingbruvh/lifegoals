"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Compass,
  Download,
  FileText,
  Flag,
  HeartHandshake,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { dateLabel, progress } from "@/lib/model";
import { Empty, Heading, Progress, SectionTitle, Tag } from "./ui";
import { TaskChecklist } from "./courses";
import { Journey } from "./people";
import { Events } from "./activities";
export function PersonalHome() {
  const s = useStore();
  const p = s.data.people.find((p) => p.id === s.personId)!;
  const es = s.data.enrollments.filter((e) => e.personId === p.id);
  const e =
    es.find((e) => e.status !== "Afgerond" && e.status !== "Gestopt") || es[0];
  const c = s.data.courses.find((c) => c.id === e?.courseId);
  const acts = s.data.activities.filter((a) => a.participantIds.includes(p.id));
  const next = s.data.sessions
    .filter(
      (session) =>
        session.date >= "2026-11-03" &&
        acts.some((a) => a.id === session.activityId),
    )
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const a = acts.find((a) => a.id === next?.activityId);
  const moments = s.data.sessions.filter(
    (s) => s.attendance[p.id] === "present",
  ).length;
  return (
    <div className="personal-content">
      <Heading
        eyebrow="JOUW PLEK BIJ LIFE GOALS"
        title={`Hé ${p.name.split(" ")[0]}, fijn dat je er bent.`}
        subtitle="Op jouw tempo. Op jouw manier. Samen vooruit."
      />
      <section className="personal-hero">
        <div>
          <Tag tone="cream">IEDERE STAP TELT</Tag>
          <h2>
            Er begint iets moois
            <br />
            als jij <em>meedoet.</em>
          </h2>
          <p>
            Een nieuwe ervaring, een goed gesprek
            <br />
            of gewoon een fijn uur op het veld.
          </p>
          <Link href="/mijn/activiteiten" className="button">
            Ontdek jouw volgende stap <ArrowUpRight size={17} />
          </Link>
        </div>
        <img src="/sport.jpg" alt="Samen sporten bij Life Goals" />
      </section>
      <div className="two-columns">
        <section className="card next-card">
          <SectionTitle title="Binnenkort voor jou" />
          {a ? (
            <>
              <div className="next-date">
                <CalendarDays size={18} />
                {dateLabel(next.date)} · {next.time}
              </div>
              <h2>{a.title}</h2>
              <p>
                <MapPin size={16} />
                {a.location}
              </p>
              <div className="next-card-bottom">
                <Tag tone="green">
                  <Check size={13} /> Je staat op de lijst
                </Tag>
                <Link href="/mijn/activiteiten" className="text-link">
                  Bekijk <ArrowUpRight size={17} />
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2>Waar wil jij beginnen?</h2>
              <p>Ontdek een activiteit die bij jou past.</p>
              <Link className="text-link" href="/mijn/activiteiten">
                Bekijk activiteiten <ArrowUpRight size={17} />
              </Link>
            </>
          )}
        </section>
        <section className="card learning-card">
          <SectionTitle
            title="Jouw leerreis"
            href="/mijn/portfolio"
            label="Mijn portfolio"
          />
          {c && e ? (
            <>
              <BookOpen size={27} />
              <h2>{c.title}</h2>
              <p>
                Je hebt {e.tasks.filter((t) => t === "done").length} onderdelen
                afgerond. Elke stap telt.
              </p>
              <Progress value={progress(e)} />
            </>
          ) : (
            <Empty title="Je leerreis ligt voor je open">
              Ontdek de opleidingen onder Ontdek & doe mee.
            </Empty>
          )}
        </section>
      </div>
      <section className="personal-next-step">
        <span>
          <Flag size={24} />
        </span>
        <div>
          <div className="eyebrow">JOUW VOLGENDE STAP</div>
          <h2>
            {e
              ? "Ontdek waar jouw talent ligt."
              : "Geef jezelf een nieuwe ervaring."}
          </h2>
          <p>
            {e
              ? "Bekijk je portfolio en bespreek je volgende opdracht met je opleider."
              : "Er is altijd een activiteit of opleiding die bij je past."}
          </p>
        </div>
        <Link
          href={e ? "/mijn/portfolio" : "/mijn/activiteiten"}
          aria-label="Bekijk mijn volgende stap"
        >
          <ChevronRight size={24} />
        </Link>
      </section>
      <div className="two-columns">
        <section className="card">
          <SectionTitle title="Kijk eens wat je al hebt gedaan" />
          <div className="personal-moments">
            <b>{moments}</b>
            <span>
              keer samen gesport.
              <br />
              En jouw verhaal gaat verder.
            </span>
          </div>
          <Link href="/mijn/reis" className="text-link">
            Bekijk jouw momenten <ArrowUpRight size={17} />
          </Link>
        </section>
        <section className="card volunteer-teaser">
          <HeartHandshake size={25} />
          <h2>Jouw hulp is welkom.</h2>
          <p>
            Help mee bij een sportevent. Nieuwe mensen, nieuwe ervaringen, en
            een mooie dag samen.
          </p>
          <Link href="/mijn/activiteiten/events" className="text-link">
            Ontdek waar je kunt helpen <ArrowUpRight size={17} />
          </Link>
        </section>
      </div>
    </div>
  );
}
export function Portfolio() {
  const s = useStore();
  const [selected, setSelected] = useState("");
  const [tab, setTab] = useState("Overzicht");
  const es = s.data.enrollments.filter((e) => e.personId === s.personId);
  const e = es.find((e) => e.id === selected) || es[0];
  const c = s.data.courses.find((c) => c.id === e?.courseId);
  if (!e || !c)
    return (
      <>
        <Heading
          title="Jouw leerreis begint hier"
          subtitle="Ontdek een opleiding die bij je past."
        />
        <Link className="button" href="/mijn/activiteiten">
          Ontdek opleidingen <ArrowUpRight size={17} />
        </Link>
      </>
    );
  return (
    <div className="personal-content">
      <Heading
        eyebrow="LEREN OP JOUW MANIER"
        title="Mijn leerreis"
        subtitle="Wat je hebt geleerd. Wat nog komt. Allemaal op één plek."
        action={
          es.length > 1 && (
            <select
              aria-label="Mijn opleiding"
              value={e.id}
              onChange={(ev) => setSelected(ev.target.value)}
            >
              {es.map((en) => (
                <option value={en.id} key={en.id}>
                  {s.data.courses.find((c) => c.id === en.courseId)!.title}
                </option>
              ))}
            </select>
          )
        }
      />
      <section className="portfolio-header">
        <span className="course-icon">
          <BookOpen size={27} />
        </span>
        <div>
          <Tag tone="green">{e.status}</Tag>
          <h2>{c.title}</h2>
          <p>
            {c.region} · {dateLabel(c.start)} – {dateLabel(c.end)}
          </p>
        </div>
        <div
          className="progress-ring"
          style={{
            background: `conic-gradient(#d53b45 ${progress(e)}%,#e6e3d9 0)`,
          }}
        >
          <span>
            {progress(e)}
            <small>%</small>
          </span>
        </div>
      </section>
      <div className="tabs detail-tabs">
        {[
          "Overzicht",
          "Opdrachten",
          "Documenten",
          "Administratie",
          "Tijdlijn",
        ].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "active" : ""}
          >
            {t}
          </button>
        ))}
      </div>
      <section className="card">
        {tab === "Overzicht" || tab === "Administratie" ? (
          <>
            <SectionTitle
              title={
                tab === "Overzicht"
                  ? "Stap voor stap vooruit"
                  : "Alles overzichtelijk bij elkaar"
              }
              subtitle="Je opleider werkt de voortgang samen met jou bij."
            />
            <TaskChecklist enrollment={e} />
          </>
        ) : tab === "Opdrachten" ? (
          <>
            <SectionTitle
              title="Jouw opdrachten"
              subtitle="Generieke voorbeeldopdrachten voor deze conceptdemo"
            />
            <div className="assignment">
              <span className="course-icon">
                <Flag size={23} />
              </span>
              <div>
                <h2>Mijn talenten & een activiteit voorbereiden</h2>
                <p>
                  Bedenk wat jij leuk vindt om te doen. Beschrijf hoe je jouw
                  talent kunt inzetten bij een sportactiviteit.
                </p>
                <Tag tone={e.tasks[6] === "done" ? "green" : ""}>
                  {e.tasks[6] === "done"
                    ? "Afgerond met je opleider"
                    : "Bespreek dit met je opleider"}
                </Tag>
              </div>
            </div>
            <p className="fine">
              In deze demo beoordeelt de opleider de opdracht in het portfolio.
              Er worden geen bestanden of persoonlijke antwoorden verzameld.
            </p>
          </>
        ) : tab === "Documenten" ? (
          <>
            <SectionTitle
              title="Jouw documenten"
              subtitle="Een klein voorbeeld om mee te beginnen"
            />
            <a href="/voorbeeld-opdracht.txt" download className="document-row">
              <FileText size={24} />
              <div>
                <h3>Mijn volgende stap</h3>
                <p>Voorbeeldopdracht · tekstbestand · fictief</p>
              </div>
              <Download size={20} />
            </a>
            <p className="fine">
              Dit is een generiek voorbeeld, geen officieel Life Goals
              startdocument of ondertekend dossier.
            </p>
          </>
        ) : (
          <Journey personId={s.personId} />
        )}
      </section>
    </div>
  );
}
export function Discover() {
  const s = useStore();
  const [tab, setTab] = useState("Sportactiviteiten");
  const p = s.data.people.find((p) => p.id === s.personId)!;
  return (
    <div className="personal-content">
      <Heading
        eyebrow="ONTMOETEN. ONTDEKKEN. MEEDOEN."
        title="Wat wordt jouw volgende stap?"
        subtitle="Je hoeft het niet alleen te doen. Ontdek wat bij jou past."
      />
      <div className="tabs detail-tabs">
        {["Sportactiviteiten", "Opleidingen", "Events & meehelpen"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "active" : ""}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Sportactiviteiten" ? (
        <>
          <SectionTitle title={`Bij jou in de buurt · ${p.region}`} />
          <div className="activity-grid">
            {s.data.activities
              .filter((a) => a.region === p.region)
              .map((a) => {
                const joined = a.participantIds.includes(p.id);
                return (
                  <section className="card discover-card" key={a.id}>
                    <span className="sport-label">{a.sport}</span>
                    <h2>{a.title}</h2>
                    <p>
                      <MapPin size={16} />
                      {a.location}
                    </p>
                    <p>
                      <CalendarDays size={16} />
                      {a.schedule}
                    </p>
                    <p className="fine">
                      Coach:{" "}
                      {s.data.people.find((p) => p.id === a.coachId)!.name}.
                      Iedereen is welkom; ervaring is niet nodig.
                    </p>
                    <button
                      className={`button ${joined ? "success-button" : ""}`}
                      disabled={joined}
                      onClick={() => s.joinActivity(a.id, p.id)}
                    >
                      {joined ? (
                        <>
                          <Check size={17} /> Je doet mee
                        </>
                      ) : (
                        <>
                          Ik doe mee <ArrowUpRight size={17} />
                        </>
                      )}
                    </button>
                  </section>
                );
              })}
          </div>
        </>
      ) : tab === "Opleidingen" ? (
        <div className="activity-grid">
          {s.data.courses
            .filter((c) => c.region === p.region)
            .map((c) => {
              const joined = s.data.enrollments.some(
                (e) => e.personId === p.id && e.courseId === c.id,
              );
              return (
                <section className="card discover-card" key={c.id}>
                  <BookOpen size={26} />
                  <h2>{c.title}</h2>
                  <p>{c.description}</p>
                  <p className="fine">
                    {c.location} · {dateLabel(c.start)}
                  </p>
                  {joined ? (
                    <Link href="/mijn/portfolio" className="button secondary">
                      Naar mijn portfolio <ChevronRight size={17} />
                    </Link>
                  ) : (
                    <Link href={`/aanmelden/${c.id}`} className="button">
                      Bekijk & meld je aan <ArrowUpRight size={17} />
                    </Link>
                  )}
                </section>
              );
            })}
        </div>
      ) : (
        <Events personal />
      )}
    </div>
  );
}
