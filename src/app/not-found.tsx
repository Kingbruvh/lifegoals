import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty">
      <h1>Even de weg kwijt?</h1>
      <Link href="/">Terug naar Life Goals</Link>
    </main>
  );
}
