"use client";
import { ReactNode, useEffect, useRef, useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronRight, X } from "lucide-react";
import { initials } from "@/lib/model";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${light ? "light" : ""}`}
      aria-label="Life Goals start"
    >
      <img src="/life-goals.svg" alt="Life Goals" />
      <span>
        hub<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
/** "Nebula" — the brandbook's brush-stroke element. Coloured via currentColor. */
export function Nebula({ className = "" }: { className?: string }) {
  return <span className={`nebula ${className}`} aria-hidden="true" />;
}
/** Counts a number (with optional suffix such as "%") to its value, and
 *  animates from the previous value with a short highlight when it changes. */
export function CountUp({ value }: { value: string | number }) {
  const match = String(value).match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const [shown, setShown] = useState(0);
  const [bump, setBump] = useState(false);
  const from = useRef(0);
  const first = useRef(true);
  useEffect(() => {
    if (!match) return;
    const start = from.current;
    from.current = target;
    if (!first.current && start !== target) {
      setBump(true);
      setTimeout(() => setBump(false), 900);
    }
    first.current = false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 900);
      setShown(Math.round(start + (target - start) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    // Fallback: frames pause in background tabs, so always land on the value.
    const settle = setTimeout(() => setShown(target), 950);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  if (!match) return <>{value}</>;
  return (
    <span className={bump ? "bump" : undefined}>
      {shown}
      {match[2]}
    </span>
  );
}
export function Avatar({ name, size = "" }: { name: string; size?: string }) {
  return (
    <span
      className={`avatar ${size}`}
      style={{
        background: ["#f8e1e2", "#faf8db", "#ececea", "#f7e0d9"][
          name.length % 4
        ],
      }}
    >
      {initials(name)}
    </span>
  );
}
export function Tag({
  children,
  tone = "",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={`tag ${tone}`}>{children}</span>;
}
export function Heading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
export function SectionTitle({
  title,
  subtitle,
  href,
  label = "Bekijk alles",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="text-link">
          {label}
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function Progress({
  value,
  label = "Voortgang",
}: {
  value: number;
  label?: string;
}) {
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{label}</span>
        <b>{value}%</b>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
export function Empty({
  title = "Nog niets om te laten zien",
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty-symbol">↗</div>
      <h3>{title}</h3>
      <p>{children || "Zodra er iets verandert, zie je het hier."}</p>
    </div>
  );
}
export function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const node = ref.current;
    node?.showModal();
    return () => node?.close();
  }, []);
  // Play the exit animation before the parent unmounts the dialog.
  function dismiss() {
    if (closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return close();
    setClosing(true);
    setTimeout(close, 200);
  }
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={`modal ${closing ? "closing" : ""}`}
      onCancel={(e) => {
        e.preventDefault();
        dismiss();
      }}
      onClick={(e) => {
        if (e.target === ref.current) dismiss();
      }}
    >
      <div className="modal-inner">
        <span className="sheet-handle" aria-hidden="true" />
        <div className="section-title">
          <h2 id={titleId}>{title}</h2>
          <button
            className="icon-button"
            onClick={dismiss}
            aria-label="Sluiten"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function Stat({
  label,
  value,
  note,
  icon,
  highlight = false,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`stat ${highlight ? "highlight" : ""}`}>
      <div className="stat-label">
        {label}
        <span>{icon}</span>
      </div>
      <div className="stat-value">
        <CountUp value={value} />
      </div>
      <div className="stat-note">
        {highlight && <Check size={13} />} {note}
      </div>
    </div>
  );
}
export function Go({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`button ${secondary ? "secondary" : ""}`} href={href}>
      {children}
      <ChevronRight size={17} />
    </Link>
  );
}
