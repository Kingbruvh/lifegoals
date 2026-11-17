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
/** Counts a number (with optional suffix such as "%") up from zero once. */
export function CountUp({ value }: { value: string | number }) {
  const match = String(value).match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const [shown, setShown] = useState(match ? 0 : target);
  useEffect(() => {
    if (!match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setShown(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  if (!match) return <>{value}</>;
  return (
    <>
      {shown}
      {match[2]}
    </>
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
  useEffect(() => {
    const node = ref.current;
    node?.showModal();
    return () => node?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className="modal-inner">
        <div className="section-title">
          <h2 id={titleId}>{title}</h2>
          <button className="icon-button" onClick={close} aria-label="Sluiten">
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
