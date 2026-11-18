import Link from "next/link";

export default function NewMeetingPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">New meeting</h1>
      <p className="mt-4">Meeting creation is planned for W04.</p>
      <Link href="/meetings" className="mt-4 inline-block text-blue-700 underline">Back to meetings</Link>
    </section>
  );
}
