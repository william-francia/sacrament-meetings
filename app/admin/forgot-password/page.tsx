import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Password recovery", description: "Information about account password recovery.", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  notFound();
}
