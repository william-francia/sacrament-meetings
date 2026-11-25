"use client";
import Link from "next/link";
export default function Error({ retry }: { retry: () => void }) { return <section className="mx-auto max-w-4xl rounded-xl bg-white p-8"><h1 className="text-2xl font-bold">We could not load meetings</h1><p className="mt-2">Please try again in a moment.</p><div className="mt-5 flex gap-4"><button onClick={() => retry()} className="rounded-lg bg-blue-800 px-4 py-2 text-white">Try Again</button><Link href="/meetings" className="p-2 text-blue-800 underline">Back to Meetings</Link></div></section>; }
