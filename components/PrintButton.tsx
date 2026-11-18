
"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-lg bg-blue-700 px-5 py-2 text-white hover:bg-blue-800"
    >
      Print Program
    </button>
  );
}
