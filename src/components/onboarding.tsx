"use client";
import { KeyboardEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ArrowLeft, Check, Mail, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { Nebula } from "./ui";

const STEPS = 4; // name, email, code, done (the intro is step 0)
const ease = [0.22, 1, 0.36, 1] as const;
const slide = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0, filter: "blur(6px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir * -48, opacity: 0, filter: "blur(6px)" }),
};
const validEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());

/** Duolingo-style sign-up for new participants: one question per screen. */
export function Onboarding() {
  const s = useStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(0);
  const [mail, setMail] = useState(false);
  const [sent, setSent] = useState("");
  const first = name.trim().split(" ")[0];

  // Every visit to the code step "sends" a fresh simulated code.
  useEffect(() => {
    if (step !== 3) return setMail(false);
    setSent(String(Math.floor(100000 + Math.random() * 900000)));
    setCode("");
    const t = setTimeout(() => setMail(true), 1100);
    return () => clearTimeout(t);
  }, [step]);

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }
  function fail() {
    setShake((n) => n + 1);
  }
  function verify(value: string) {
    if (value !== sent) return fail();
    try {
      s.signUp(name, email);
      go(4);
    } catch (e) {
      s.notify((e as Error).message);
      go(2);
    }
  }
  function fillCode() {
    setMail(false);
    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      setCode(sent.slice(0, i));
      if (i === 6) {
        clearInterval(tick);
        setTimeout(() => verify(sent), 350);
      }
    }, 90);
  }
  const canNext =
    step === 1 ? name.trim().length > 1 : step === 2 ? validEmail(email) : true;
  function next() {
    if (step === 1 || step === 2) {
      if (!canNext) return fail();
      go(step + 1);
    } else if (step === 3) {
      if (code.length === 6) verify(code);
      else fail();
    }
  }
  const onEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      next();
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={`onb onb-step-${step}`}>
        {step > 0 && step < 4 && (
          <header className="onb-top">
            <button
              className="onb-icon"
              aria-label="Terug"
              onClick={() => go(step - 1)}
            >
              <ArrowLeft size={22} />
            </button>
            <div
              className="onb-progress"
              role="progressbar"
              aria-label="Voortgang aanmelden"
              aria-valuemin={0}
              aria-valuemax={STEPS}
              aria-valuenow={step}
            >
              <motion.span
                initial={false}
                animate={{ width: `${(step / STEPS) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
            <Link className="onb-icon" href="/" aria-label="Stoppen">
              <X size={22} />
            </Link>
          </header>
        )}

        <AnimatePresence>
          {mail && (
            <motion.button
              className="onb-mail"
              onClick={fillCode}
              initial={{ y: -90, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <span className="onb-mail-icon">
                <Mail size={18} />
              </span>
              <span>
                <b>Life Goals · nu</b>
                Je inlogcode is <strong>{sent}</strong>
              </span>
              <em>Invullen</em>
            </motion.button>
          )}
        </AnimatePresence>

        <main className="onb-stage">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.section
              key={step}
              className="onb-screen"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease }}
            >
              {step === 0 && (
                <div className="onb-intro">
                  <div className="onb-mark">
                    <Nebula className="onb-nebula" />
                    <img src="/life-goals.svg" alt="Life Goals" />
                  </div>
                  <h1>
                    Sport voor
                    <br />
                    perspectief.
                  </h1>
                  <p>Maak in een minuut je account.</p>
                </div>
              )}
              {step === 1 && (
                <>
                  <h1>Hoe heet je?</h1>
                  <motion.input
                    key={`n${shake}`}
                    animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="onb-input"
                    autoFocus
                    aria-label="Je naam"
                    placeholder="Je voornaam"
                    autoComplete="given-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={onEnter}
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <h1>
                    Hoi {first}!
                    <br />
                    Wat is je e-mail?
                  </h1>
                  <motion.input
                    key={`e${shake}`}
                    animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="onb-input"
                    autoFocus
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    aria-label="Je e-mailadres"
                    placeholder="naam@voorbeeld.nl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={onEnter}
                  />
                  <p className="onb-hint">
                    Geen wachtwoord. Je krijgt een code.
                  </p>
                </>
              )}
              {step === 3 && (
                <>
                  <h1>Vul je code in</h1>
                  <p className="onb-hint">Gestuurd naar {email.trim()}</p>
                  <motion.label
                    key={`c${shake}`}
                    animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="onb-code"
                  >
                    <input
                      autoFocus
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      aria-label="Inlogcode van 6 cijfers"
                      maxLength={6}
                      value={code}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setCode(v);
                        if (v.length === 6) verify(v);
                      }}
                      onKeyDown={onEnter}
                    />
                    {Array.from({ length: 6 }, (_, i) => (
                      <span
                        key={i}
                        className={`${code[i] ? "filled" : ""} ${i === code.length ? "caret" : ""}`}
                        aria-hidden="true"
                      >
                        {code[i] || ""}
                      </span>
                    ))}
                  </motion.label>
                  <button className="onb-resend" onClick={() => setMail(true)}>
                    Geen code gezien?
                  </button>
                </>
              )}
              {step === 4 && (
                <div className="onb-done">
                  <div className="onb-burst" aria-hidden="true">
                    {Array.from({ length: 18 }, (_, i) => (
                      <i key={i} style={{ ["--i" as string]: i }} />
                    ))}
                  </div>
                  <motion.span
                    className="onb-check"
                    initial={{ scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 14,
                      delay: 0.1,
                    }}
                  >
                    <Check size={46} strokeWidth={3} />
                  </motion.span>
                  <h1>
                    Welkom in het team,
                    <br />
                    <em>{first}!</em>
                  </h1>
                  <p>Never offside. Je account staat klaar.</p>
                </div>
              )}
            </motion.section>
          </AnimatePresence>
        </main>

        <footer className="onb-actions">
          {step === 0 && (
            <>
              <button className="onb-cta" onClick={() => go(1)}>
                Ik doe mee
              </button>
              <Link className="onb-secondary" href="/">
                Ik heb al een account
              </Link>
            </>
          )}
          {step > 0 && step < 4 && (
            <button
              className="onb-cta"
              aria-disabled={!canNext || (step === 3 && code.length < 6)}
              onClick={next}
            >
              {step === 3 ? "Bevestigen" : "Verder"}
            </button>
          )}
          {step === 4 && (
            <button className="onb-cta" onClick={() => router.push("/mijn")}>
              Naar mijn Life Goals
            </button>
          )}
        </footer>
      </div>
    </MotionConfig>
  );
}
