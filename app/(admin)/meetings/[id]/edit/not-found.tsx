import Link from "next/link";
export default function NotFound() { return <div className="rounded-xl bg-white p-8"><h1 className="text-2xl font-bold">Meeting not found</h1><p className="mt-2">This meeting is unavailable.</p><Link href="/meetings" className="mt-4 inline-block text-blue-800 underline">Back to Meetings</Link></div>; }
