import { DemoState, Person, Region, TaskStatus } from "./model";
export function createSeed(): DemoState {
  const names = [
    "Samira El Amrani",
    "Milan de Groot",
    "Jesse van Leeuwen",
    "Nora Yilmaz",
    "Daan Visser",
    "Amina El Idrissi",
    "Lucas Smit",
    "Sophie Jansen",
    "Yara de Jong",
    "Ravi Meijer",
    "Lina Hassan",
    "Thomas Mulder",
    "Sara van Dijk",
    "Adam Bakker",
    "Emma Bos",
    "Noah de Boer",
    "Lotte Vos",
    "Youssef Karim",
    "Isa Willems",
    "Finn Dekker",
    "Julia Peters",
    "Omar Saleh",
    "Tess Kok",
    "Liam Vermeer",
    "Mila de Wit",
    "Sem Jacobs",
    "Aya Mansour",
    "Bram van Dam",
    "Eva Groen",
    "Amir Sadiq",
    "Fleur Hendriks",
    "Ryan van Beek",
    "Zara Ali",
    "Mees van Vliet",
    "Iris Kuiper",
    "Nadir Rahman",
  ];
  const people: Person[] = names.map((name, i) => ({
    id: `p${i}`,
    name,
    email: `deelnemer${i + 1}@example.invalid`,
    region: (i < 20 ? "Amsterdam" : i < 28 ? "Utrecht" : "Rotterdam") as Region,
    roles:
      i === 0
        ? ["Deelnemer"]
        : [1, 4, 7, 20, 23, 28].includes(i)
          ? ["Deelnemer", "Coach"]
          : ["Deelnemer"],
    joined: `2026-09-${String(1 + (i % 20)).padStart(2, "0")}`,
    eligible: true,
  }));
  ["p4", "p7", "p20", "p28"].forEach((id) =>
    people.find((p) => p.id === id)!.roles.push("Vrijwilliger"),
  );
  ["Robin van Dijk", "Kim Verhoeven", "Alex van Rijn"].forEach((name, i) =>
    people.push({
      id: `t${i}`,
      name,
      email: `opleider${i + 1}@example.invalid`,
      region: ["Amsterdam", "Utrecht", "Rotterdam"][i] as Region,
      roles: ["Opleider"],
      joined: "2026-08-01",
      eligible: true,
    }),
  );
  const courses = [
    {
      id: "c1",
      title: "MDT Set Your Life Goals",
      program: "MDT Set Your Life Goals",
      region: "Amsterdam" as Region,
      start: "2026-09-14",
      end: "2026-12-18",
      trainerId: "t0",
      capacity: 24,
      location: "Sportcentrum Caland",
      description:
        "Ontdek je talenten, ontmoet nieuwe mensen en maak het verschil met sport.",
    },
    {
      id: "c2",
      title: "Maatschappelijk Sportcoach",
      program: "Maatschappelijk Sportcoach",
      region: "Amsterdam" as Region,
      start: "2026-10-01",
      end: "2026-12-10",
      trainerId: "t0",
      capacity: 16,
      location: "Sporthallen Zuid",
      description:
        "Leer hoe je een warme, toegankelijke sportactiviteit begeleidt.",
    },
    {
      id: "c3",
      title: "MDT Set Your Life Goals",
      program: "MDT Set Your Life Goals",
      region: "Utrecht" as Region,
      start: "2026-09-21",
      end: "2026-12-21",
      trainerId: "t1",
      capacity: 16,
      location: "Sportcentrum Galgenwaard",
      description: "Samen werken aan jouw volgende stap, op en naast het veld.",
    },
    {
      id: "c4",
      title: "Maatschappelijk Sportcoach",
      program: "Maatschappelijk Sportcoach",
      region: "Rotterdam" as Region,
      start: "2026-09-08",
      end: "2026-11-27",
      trainerId: "t2",
      capacity: 16,
      location: "Sportcentrum West",
      description: "Breng mensen in beweging met laagdrempelige sport en spel.",
    },
    {
      id: "c5",
      title: "Samen sport organiseren",
      program: "Life Goals Academie",
      region: "Amsterdam" as Region,
      start: "2026-11-16",
      end: "2026-12-14",
      trainerId: "t0",
      capacity: 12,
      location: "Buurtcentrum De Meeuw",
      description: "Van een eerste idee naar een sportdag voor de buurt.",
    },
  ];
  const enrollments = names.map((_, i) => ({
    id: `en${i}`,
    personId: `p${i}`,
    courseId: i < 12 ? "c1" : i < 20 ? "c2" : i < 28 ? "c3" : "c4",
    date: `2026-09-${String(1 + (i % 20)).padStart(2, "0")}`,
    status: (i % 11 === 10 ? "Afgerond" : "Deelnemend") as
      "Afgerond" | "Deelnemend",
    tasks: (i % 11 === 10
      ? Array(8).fill("done")
      : [
          "done",
          "done",
          i % 3 === 0 ? "pending" : "done",
          "done",
          "na",
          i % 4 === 0 ? "missing" : "pending",
          "pending",
          "na",
        ]) as TaskStatus[],
  }));
  const activityNames = [
    "Samen voetballen",
    "Boksen & bewegen",
    "Wandelen in het park",
    "Basketbal in de buurt",
    "Samen fit",
    "Voetbal voor iedereen",
    "Bootcamp buiten",
    "Samen hardlopen",
    "Sport & spel",
  ];
  const activities = activityNames.map((title, i) => ({
    id: `a${i}`,
    title,
    sport: [
      "Voetbal",
      "Boksen",
      "Wandelen",
      "Basketbal",
      "Fitness",
      "Voetbal",
      "Bootcamp",
      "Hardlopen",
      "Sport & spel",
    ][i],
    region: (i < 4 ? "Amsterdam" : i < 7 ? "Utrecht" : "Rotterdam") as Region,
    location: [
      "Sportpark Sloten",
      "Sportcentrum Caland",
      "Westerpark",
      "Bijlmer Sportpark",
      "Park Transwijk",
      "Sportpark Zuilen",
      "Griftpark",
      "Het Park",
      "Sportcentrum West",
    ][i],
    coachId: ["p1", "p4", "p7", "p1", "p20", "p23", "p20", "p28", "p28"][i],
    schedule: [
      "Dinsdag · 16:00–17:00",
      "Woensdag · 10:00–11:00",
      "Donderdag · 09:30–10:30",
    ][i % 3],
    participantIds: people
      .filter(
        (p) =>
          p.roles.includes("Deelnemer") &&
          p.region === (i < 4 ? "Amsterdam" : i < 7 ? "Utrecht" : "Rotterdam"),
      )
      .filter((_, j) => j % 2 === i % 2 || j === 0)
      .map((p) => p.id),
  }));
  const sessions = activities.flatMap((a, ai) =>
    Array.from({ length: 7 }, (_, w) => {
      const date = new Date(Date.UTC(2026, 8, 22 + w * 7 + (ai % 3)))
        .toISOString()
        .slice(0, 10);
      return {
        id: `s${ai}-${w}`,
        activityId: a.id,
        date,
        time: ai % 3 === 0 ? "16:00" : ai % 3 === 1 ? "10:00" : "09:30",
        attendance:
          w === 6
            ? {}
            : (Object.fromEntries(
                a.participantIds.map((id, i) => [
                  id,
                  (i + w + ai) % 6 === 0 ? "absent" : "present",
                ]),
              ) as Record<string, "present" | "absent">),
      };
    }),
  );
  return {
    version: 1,
    people,
    courses,
    enrollments,
    activities,
    sessions,
    events: [
      {
        id: "ev1",
        title: "Life Goals Sportfestival",
        region: "Amsterdam",
        date: "2026-11-21",
        location: "Sportpark Sloten",
        description:
          "Een dag vol sport, ontmoeting en plezier. Help mee met de ontvangst en sportonderdelen.",
        capacity: 12,
        volunteerIds: ["p4", "p7"],
        participantIds: ["p2", "p3", "p5"],
      },
      {
        id: "ev2",
        title: "Samen in beweging",
        region: "Utrecht",
        date: "2026-11-28",
        location: "Park Transwijk",
        description:
          "Een sportieve middag voor de hele buurt. We zoeken helpende handen op en naast het veld.",
        capacity: 8,
        volunteerIds: ["p20"],
        participantIds: ["p21", "p22"],
      },
      {
        id: "ev3",
        title: "Winter Games",
        region: "Rotterdam",
        date: "2026-12-12",
        location: "Sportcentrum West",
        description:
          "Samen sluiten we het jaar sportief af. Doe mee of help als vrijwilliger.",
        capacity: 10,
        volunteerIds: ["p28"],
        participantIds: ["p29", "p30"],
      },
    ],
    journey: [
      {
        id: "j0",
        personId: "p0",
        date: "2026-10-20",
        title: "Een eerste stap op het veld",
        detail: "Meegeholpen met de warming-up bij Samen voetballen.",
        kind: "portfolio",
      },
    ],
    monitoring: people
      .filter((p) => p.roles.includes("Deelnemer"))
      .map((p, i) => ({ personId: p.id, connected: i % 4 !== 0 })),
  };
}
