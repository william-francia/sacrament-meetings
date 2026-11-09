
import Link from "next/link";
import Image from "next/image";

export default function HomeIntro() {
  return (
    <section className="w-full rounded-xl bg-blue-50 p-6 text-center text-slate-900">
      <Image
        src="/file.svg"
        alt="Document icon representing a meeting program"
        width={64}
        height={64}
        className="mx-auto mb-4"
      />

      <h1 className="text-3xl font-bold">
        Sacrament Meeting Planner
      </h1>

      <p className="mt-4 text-gray-700">
        Welcome! Here you can view Sunday meeting
        programs, hymns, prayers, and speakers.
      </p>

      <Link
        href="/meetings"
        className="mt-6 inline-block rounded-lg bg-blue-700 px-6 py-3 text-white"
      >
        View Meetings
      </Link>
    </section>
  );
}
