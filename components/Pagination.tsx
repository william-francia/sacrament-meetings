import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  query: string;
}

export default function Pagination({ page, totalPages, query }: PaginationProps) {
  if (totalPages === 0) return null;

  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    params.set("page", String(target));
    return `/meetings?${params}`;
  };
  const linkClassName = "rounded px-2 py-1 text-blue-700 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
  const disabledClassName = "cursor-not-allowed px-2 py-1 text-gray-500";

  return (
    <nav aria-label="Meeting pages" className="mt-6 flex flex-wrap items-center gap-4">
      {page > 1 ? (
        <Link href={pageHref(page - 1)} rel="prev" className={linkClassName}>
          Previous
        </Link>
      ) : (
        <span role="link" aria-disabled="true" className={disabledClassName}>Previous</span>
      )}
      <span aria-live="polite" aria-atomic="true">Page {page} of {totalPages}</span>
      {page < totalPages ? (
        <Link href={pageHref(page + 1)} rel="next" className={linkClassName}>
          Next
        </Link>
      ) : (
        <span role="link" aria-disabled="true" className={disabledClassName}>Next</span>
      )}
    </nav>
  );
}
