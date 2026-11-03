"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Activity as ActivityIcon,
  GraduationCap,
  ArrowUpRight,
  Plus,
  ArrowRight,
  MapPin,
  Clock,
  CheckCheck,
  HeartHandshake,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "@/lib/store";
import { Scope, regions, metrics, dateLabel, progress } from "@/lib/model";
import { Avatar, Heading, SectionTitle, Stat, Tag, Progress } from "./ui";
export function RegionSelect({
  value,
  onChange,
  regional = false,
}: {
  value: Scope;
  onChange: (v: Scope) => void;
  regional?: boolean;
}) {
  return (
    <label className="region-control">
      <MapPin size={16} />
      <select
        aria-label="Regio"
        value={value}
        onChange={(e) => onChange(e.target.value as Scope)}
      >
        {!regional && <option>Alle regio’s</option>}
        {(regional ? ["Amsterdam"] : regions).map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
    </label>
  );
}
export function ParticipationChart({ scope }: { scope: Scope }) {
  const { data } = useStore();
  const m = metrics(data, scope);
  const chart = Array.from({ length: 7 }, (_, i) => {
    const start = new Date(Date.UTC(2026, 8, 22 + i * 7))
      .toISOString()
      .slice(0, 10);
    const end = new Date(Date.UTC(2026, 8, 29 + i * 7))
      .toISOString()
      .slice(0, 10);
    return {
      name: dateLabel(start),
      aanwezig: m.sessions
        .filter((s) => s.date >= start && s.date < end)
        .reduce(
          (sum, s) =>
            sum +
            Object.values(s.attendance).filter((v) => v === "present").length,
          0,
        ),
    };
  });
  return (
    <div
      className="chart"
      role="img"
      aria-label={`Aanwezigheid per week: ${chart.map((d) => `${d.name}: ${d.aanwezig}`).join(", ")}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chart}
          margin={{ left: -25, right: 8, top: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="coral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d53b45" stopOpacity={0.16} />
              <stop offset="100%" stopColor="#d53b45" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#efefed" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#838480" }}
            dy={12}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#838480" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #eee",
              fontSize: 12,
            }}
            formatter={(v) => [v, "Aanwezig"]}
          />
          <Area
            type="monotone"
            dataKey="aanwezig"
            stroke="#d53b45"
            strokeWidth={2.5}
            fill="url(#coral)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export function Dashboard() {
  const { data, role } = useStore();
  const [scope, setScope] = useState<Scope>(
    role === "regional" ? "Amsterdam" : "Alle regio’s",
  );
  const m = metrics(data, scope);
  const upcoming = m.sessions
    .filter((s) => s.date >= "2026-11-03")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);
  const attention = m.enrollments.filter((e) =>
    e.tasks.some((t) => t === "missing"),
  );
  return (
    <>
      <Heading
        eyebrow="DINSDAG 3 NOVEMBER 2026 · DEMOWEEK"
        title={`Goedemorgen, ${role === "regional" ? "Eva" : "Noor"}`}
        subtitle="Mooi dat je er bent. Dit is wat er beweegt in jouw netwerk."
        action={
          <RegionSelect
            value={scope}
            onChange={setScope}
            regional={role === "regional"}
          />
        }
      />
      <div className="dashboard-hero">
        <div>
          <Tag tone="cream">SAMEN IN BEWEGING</Tag>
          <h2>
            Kleine stappen.
            <br />
            Groot verschil.
          </h2>
          <p>
            Achter ieder getal zit een mens.
            <br />
            Maak vandaag ruimte voor een volgende stap.
          </p>
          <Link href="/hub/deelnemers/p0">
            Ontdek Samira’s verhaal <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="hero-image">
          <img src="/sport.jpg" alt="Een sportieve ontmoeting bij Life Goals" />
          <span className="image-caption">
            <span className="status-dot" /> Sport verbindt. Iedereen doet mee.
          </span>
        </div>
      </div>
      <div className="stats-grid">
        <Stat
          label="Unieke deelnemers"
          value={m.people.length}
          note={`${m.active} actief op het sportveld`}
          icon={<Users size={17} />}
        />
        <Stat
          label="Actieve opleidingen"
          value={m.courses.length}
          note={`${m.enrollments.length} inschrijvingen in totaal`}
          icon={<GraduationCap size={17} />}
        />
        <Stat
          label="Wekelijkse activiteiten"
          value={m.activities.length}
          note={`Begeleid door ${m.coaches} coaches`}
          icon={<ActivityIcon size={17} />}
        />
        <Stat
          label="Aanwezigheid"
          value={`${m.rate}%`}
          note={`${m.present} sportmomenten bijgewoond`}
          icon={<CheckCheck size={17} />}
          highlight
        />
      </div>
      <div className="dashboard-grid">
        <section className="card chart-card">
          <SectionTitle
            title="Samen steeds in beweging"
            subtitle="Aanwezigheid bij sportactiviteiten · per week"
            href="/hub/monitor"
            label="Naar de Monitor"
          />
          <div className="chart-summary">
            <b>{m.present}</b>
            <span>bijgewoonde sportmomenten</span>
            <Tag>Laatste 7 weken</Tag>
          </div>
          <ParticipationChart scope={scope} />
          <p className="fine">
            De huidige demoweek is nog niet volledig geregistreerd.
          </p>
        </section>
        <section className="card attention-card">
          <SectionTitle title="Even aandacht voor" />
          <div className="attention-icon">
            <CheckCheck size={24} />
          </div>
          <h3>
            {attention.length} deelnemers
            <br />
            een stap verder helpen
          </h3>
          <p>
            Een startdocument of ander onderdeel ontbreekt nog. Samen maken we
            de administratie compleet.
          </p>
          <Link className="text-link" href="/hub/opleidingen">
            Bekijk de opleidingen <ArrowRight size={16} />
          </Link>
          <div className="attention-bottom">
            <span className="status-dot" />
            {m.ready} dossiers administratief op orde
          </div>
        </section>
        <section className="card">
          <SectionTitle
            title="Binnenkort op het veld"
            href="/hub/activiteiten"
          />
          <div className="activity-list">
            {upcoming.map((s) => {
              const a = data.activities.find((a) => a.id === s.activityId)!;
              return (
                <Link
                  href={`/hub/activiteiten/${a.id}`}
                  className="activity-row"
                  key={s.id}
                >
                  <div className="date-tile">
                    <b>{s.date.slice(-2)}</b>
                    <small>NOV</small>
                  </div>
                  <div>
                    <h3>{a.title}</h3>
                    <p>
                      {a.location} <span>·</span> {s.time}
                    </p>
                  </div>
                  <span className="row-count">
                    <Users size={14} />
                    {a.participantIds.length}
                  </span>
                  <ArrowUpRight size={17} />
                </Link>
              );
            })}
          </div>
        </section>
        <section className="card">
          <SectionTitle title="Leren & groeien" href="/hub/opleidingen" />
          <div className="course-mini-list">
            {m.courses.slice(0, 2).map((c) => {
              const es = data.enrollments.filter((e) => e.courseId === c.id);
              const avg = es.length
                ? Math.round(
                    es.reduce((n, e) => n + progress(e), 0) / es.length,
                  )
                : 0;
              return (
                <Link
                  href={`/hub/opleidingen/${c.id}`}
                  className="course-mini"
                  key={c.id}
                >
                  <span className="course-icon">
                    <GraduationCap size={20} />
                  </span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>
                      {c.region} · {es.length} deelnemers
                    </p>
                    <Progress value={avg} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
      <section className="card recent-card">
        <SectionTitle
          title="De nieuwste stappen in het netwerk"
          subtitle="Iedere aanmelding is een nieuw begin"
          href="/hub/deelnemers"
        />
        <div className="recent-grid">
          {[...m.enrollments]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 3)
            .map((e) => {
              const p = data.people.find((p) => p.id === e.personId)!;
              const c = data.courses.find((c) => c.id === e.courseId)!;
              return (
                <Link href={`/hub/deelnemers/${p.id}`} key={e.id}>
                  <Avatar name={p.name} />
                  <div>
                    <h3>{p.name}</h3>
                    <p>{c.title}</p>
                    <small>
                      {p.region} · {dateLabel(e.date)}
                    </small>
                  </div>
                  <ArrowUpRight size={17} />
                </Link>
              );
            })}
        </div>
      </section>
    </>
  );
}
export function Monitor() {
  const { data, role } = useStore();
  const [scope, setScope] = useState<Scope>(
    role === "regional" ? "Amsterdam" : "Alle regio’s",
  );
  const m = metrics(data, scope);
  const monitored = data.monitoring.filter((r) =>
    m.people.some((p) => p.id === r.personId),
  );
  const connected = monitored.filter((r) => r.connected).length;
  return (
    <>
      <Heading
        eyebrow="INZICHT DAT VERBINDT"
        title="Life Goals Monitor"
        subtitle="Een helder beeld van deelname, ontwikkeling en betrokkenheid."
        action={
          <RegionSelect
            value={scope}
            onChange={setScope}
            regional={role === "regional"}
          />
        }
      />
      <div className="notice-band">
        <span className="status-dot" /> Fictieve voorbeeldgegevens · tellingen
        volgen live de wijzigingen in deze demo.
      </div>
      <div className="stats-grid">
        <Stat
          label="Unieke deelnemers"
          value={m.people.length}
          note={`${m.active} actieve deelnemers`}
          icon={<Users size={18} />}
        />
        <Stat
          label="Bijgewoonde momenten"
          value={m.present}
          note={`${m.rate}% van geregistreerde aanwezigheid`}
          icon={<ActivityIcon size={18} />}
        />
        <Stat
          label="Opleidingsdeelname"
          value={m.enrollments.length}
          note={`${m.completed} opleidingen afgerond`}
          icon={<GraduationCap size={18} />}
        />
        <Stat
          label="Betrokken coaches"
          value={m.coaches}
          note={`${m.activities.length} wekelijkse activiteiten`}
          icon={<HeartHandshake size={18} />}
        />
      </div>
      <div className="two-columns">
        <section className="card">
          <SectionTitle
            title="Deelname door de tijd"
            subtitle="Aantal bijgewoonde sportmomenten per week"
          />
          <ParticipationChart scope={scope} />
          <p className="fine">
            De laatste week is nog in uitvoering. Geen prognose of effectmeting.
          </p>
        </section>
        <section className="card">
          <SectionTitle
            title="Van aanmelden naar afronden"
            subtitle="Actuele inschrijvingen in het netwerk"
          />
          {(["Aangemeld", "Deelnemend", "Afgerond", "Gestopt"] as const).map(
            (status, i) => {
              const count = m.enrollments.filter(
                (e) => e.status === status,
              ).length;
              return (
                <div className="comparison" key={status}>
                  <div>
                    <span>{status}</span>
                    <b>{count}</b>
                  </div>
                  <div className="comparison-track">
                    <span
                      style={{
                        width: `${(count / Math.max(1, m.enrollments.length)) * 100}%`,
                        background: [
                          "#b2b6ab",
                          "#d53b45",
                          "#698977",
                          "#b6a190",
                        ][i],
                      }}
                    />
                  </div>
                </div>
              );
            },
          )}
          <p className="fine">Eén persoon kan meerdere opleidingen volgen.</p>
        </section>
      </div>
      <section className="card">
        <SectionTitle
          title="Dichtbij, in elke regio"
          subtitle="Vergelijkbare tellingen, vanuit dezelfde gegevens"
        />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Regio</th>
                <th>Deelnemers</th>
                <th>Actief</th>
                <th>Activiteiten</th>
                <th>Aanwezigheid</th>
                <th>Inschrijvingen</th>
                <th>Coaches</th>
              </tr>
            </thead>
            <tbody>
              {(scope === "Alle regio’s" ? regions : [scope]).map((r) => {
                const v = metrics(data, r);
                return (
                  <tr key={r}>
                    <td>
                      <b>{r}</b>
                    </td>
                    <td>{v.people.length}</td>
                    <td>{v.active}</td>
                    <td>{v.activities.length}</td>
                    <td>
                      {v.rate}%{" "}
                      <small>
                        ({v.present}/{v.recorded})
                      </small>
                    </td>
                    <td>{v.enrollments.length}</td>
                    <td>{v.coaches}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <div className="monitor-bottom">
        <section className="card sample-impact">
          <Tag>FICTIEVE MONITORINGRECORDS</Tag>
          <h2>
            Ruimte voor het verhaal
            <br />
            achter de cijfers.
          </h2>
          <div className="impact-number">
            {connected}
            <span>van {monitored.length} voorbeeldrecords</span>
          </div>
          <p>
            Illustratief geregistreerd: nieuwe mensen ontmoet. Dit is geen
            gemeten Life Goals resultaat of aangetoond effect van sport.
          </p>
        </section>
        <section className="card">
          <SectionTitle
            title="Administratie met overzicht"
            subtitle="Voorbeeldstatussen, geen externe koppelingen"
          />
          <div className="large-row">
            <CheckCheck />
            <span>Dossiers op orde</span>
            <b>
              {m.ready} / {m.enrollments.length}
            </b>
          </div>
          <div className="large-row">
            <GraduationCap />
            <span>Gemiddelde checklistvoortgang</span>
            <b>
              {m.enrollments.length
                ? Math.round(
                    m.enrollments.reduce((n, e) => n + progress(e), 0) /
                      m.enrollments.length,
                  )
                : 0}
              %
            </b>
          </div>
          <p className="fine">
            Kantar, Verian en digitale ondertekening zijn alleen statusvelden.
            Er worden geen vragenlijsten verstuurd of subsidiegegevens
            geëxporteerd.
          </p>
        </section>
      </div>
    </>
  );
}
export function Regions() {
  const { data } = useStore();
  return (
    <>
      <Heading
        eyebrow="HET LIFE GOALS NETWERK"
        title="Lokaal sterk. Samen verder."
        subtitle="Drie fictieve regio’s, verbonden door sport."
      />
      <div className="three-columns">
        {regions.map((r, i) => {
          const m = metrics(data, r);
          return (
            <section className="card region-card" key={r}>
              <span className="region-number">0{i + 1}</span>
              <MapPin size={30} />
              <h2>{r}</h2>
              <p>
                {i === 0
                  ? "De volledige demoreis komt hier samen."
                  : "Een aanvullend perspectief op het netwerk."}
              </p>
              <div className="region-counts">
                <div>
                  <b>{m.people.length}</b>
                  <span>deelnemers</span>
                </div>
                <div>
                  <b>{m.activities.length}</b>
                  <span>activiteiten</span>
                </div>
              </div>
              <Link href="/hub/monitor" className="text-link">
                Bekijk in de Monitor <ArrowUpRight size={17} />
              </Link>
            </section>
          );
        })}
      </div>
    </>
  );
}
export function Future() {
  return (
    <>
      <Heading
        eyebrow="EEN MOGELIJKE VOLGENDE STAP"
        title="Gebouwd om mee te groeien."
        subtitle="Een verbonden basis opent nieuwe mogelijkheden. Dit zijn ideeën voor later."
      />
      <div className="future-hero">
        <ChartNoAxesCombined size={36} />
        <h2>
          Vandaag overzicht.
          <br />
          Morgen meer mogelijkheden.
        </h2>
        <p>
          De huidige demo verbindt mensen, opleidingen, activiteiten en
          vrijwilligerswerk. De richting voor verdere ontwikkeling bepalen we
          samen.
        </p>
      </div>
      <div className="three-columns">
        {[
          [
            "Leren & ontwikkelen",
            "Uitgebreide digitale leermiddelen, verdiepende vragenlijsten en aanvullende regionale programma’s.",
          ],
          [
            "Minder administratie",
            "Rapportages, verdere Verian-procesondersteuning en vrijwilligers- en onkostenadministratie.",
          ],
          [
            "Blijven verbinden",
            "Website-integratie en nieuwe manieren om deelnemers betrokken te houden.",
          ],
        ].map(([title, copy]) => (
          <section className="card" key={title}>
            <Tag>MOGELIJKE UITBREIDING</Tag>
            <h2>{title}</h2>
            <p>{copy}</p>
          </section>
        ))}
      </div>
      <p className="notice-band">
        Deze ideeën zijn niet gebouwd en vormen geen toezegging over de
        afgesproken eerste ontwikkelfase.
      </p>
    </>
  );
}
