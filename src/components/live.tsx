"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, Monitor as MonitorIcon } from "lucide-react";
import { Logo } from "./ui";

const DESKTOP = 1280;

/** A same-origin frame scaled down to fit, so the full desktop layout shows. */
function ScaledFrame({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ scale: 0.6, height: 800 });
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const scale = width / DESKTOP;
      setSize({ scale, height: height / scale });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="live-scaled" ref={box}>
      <iframe
        title={title}
        src={src}
        style={{
          width: DESKTOP,
          height: size.height,
          transform: `scale(${size.scale})`,
        }}
      />
    </div>
  );
}

/**
 * Live split-screen: the coach registers attendance on a phone, the national
 * dashboard next to it updates instantly. Both frames share one dataset
 * through browser storage; each frame keeps its own role (?as=…).
 */
export function LiveSplit() {
  return (
    <div className="live">
      <header className="live-header">
        <Logo light />
        <div className="live-title">
          <span className="live-dot" /> Live verbonden
        </div>
        <Link href="/hub" className="text-link">
          <ArrowLeft size={15} /> Terug
        </Link>
      </header>
      <div className="live-stage">
        <section className="live-phone-col">
          <div className="live-label">
            <Smartphone size={15} /> Coach · op het veld
          </div>
          <div className="live-phone">
            <span className="live-notch" />
            <iframe
              title="Coach registreert aanwezigheid"
              src="/coach/activiteiten/a0?as=coach"
            />
          </div>
        </section>
        <div className="live-link" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <section className="live-desk-col">
          <div className="live-label">
            <MonitorIcon size={15} /> Landelijk beheer · op kantoor
          </div>
          <div className="live-browser">
            <div className="live-browser-bar">
              <i />
              <i />
              <i />
              <span>lifegoals.nl/hub</span>
            </div>
            <ScaledFrame src="/hub?as=national" title="Landelijk dashboard" />
          </div>
        </section>
      </div>
    </div>
  );
}
