
import Link from "next/link";
import Image from "next/image";

export default function HomeIntro() {
  return (
    <section className="grid overflow-hidden rounded-2xl bg-white shadow-lg lg:grid-cols-2">
      <div className="flex flex-col justify-center p-8 sm:p-12">
      <p className="mb-3 font-semibold tracking-wide text-teal-700">SUNDAY PROGRAMS</p>
      <Image
        src="/file.svg"
        alt=""
        width={32}
        height={32}
        className="mb-4"
      />

      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Sacrament Meeting Planner
      </h1>

      <p className="mt-4 text-gray-700">
        Plan, organize, and review sacrament meeting programs in one simple place.
      </p>

      <Link
        href="/meetings"
        className="mt-6 inline-block self-start rounded-lg bg-blue-800 px-6 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        View Meetings
      </Link>
      <Link href="/meetings/current" className="mt-4 self-start font-semibold text-blue-800 underline">Current Meeting</Link>
      </div>
      <Image src="/chapel.webp" alt="A chapel building with a tall white tower beneath a blue sky" width={1151} height={963} sizes="(max-width: 1024px) 100vw, 50vw" className="h-full w-full object-cover" />
    </section>
  );
}
