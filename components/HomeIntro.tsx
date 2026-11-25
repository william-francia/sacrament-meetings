
import Link from "next/link";
import Image from "next/image";

export default function HomeIntro() {
  return (
    <section className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_-28px_rgba(20,42,57,0.35)] lg:grid-cols-2">
      <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
      <p className="mb-5 text-sm font-bold tracking-[0.2em] text-teal-700">WELCOME</p>

      <h1 className="max-w-xl text-4xl font-bold tracking-tight text-[#122d43] sm:text-5xl lg:text-6xl">
        Sacrament Meeting Planner
      </h1>

      <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-600">
        Plan, organize, and review sacrament meeting programs in one simple place.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4"><Link
        href="/meetings"
        className="inline-block rounded-lg bg-[#0f6269] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0b4f55] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        View Meetings
      </Link>
      <Link href="/meetings/current" className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-[#184d58] hover:bg-slate-50">Current Meeting</Link></div>
      </div>
      <Image src="/chapel.webp" alt="Chapel building with a tall white tower beneath a blue sky" width={1151} height={963} sizes="(max-width: 1024px) 100vw, 50vw" className="h-72 w-full object-cover object-center sm:h-96 lg:h-full" />
    </section>
  );
}
