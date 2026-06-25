import Link from "next/link";

export default function Breadcrumbs({ slug }: { slug: string[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap gap-2 text-sm text-neutral-500"
    >
      <Link href="/blog" className="hover:underline">
        Blog
      </Link>

      {slug.map((segment, index) => {
        const target = slug.slice(0, index + 1).join("/");

        return (
          <span key={target} className="flex gap-2">
            <span aria-hidden="true">/</span>

            <Link
              href={`/blog/${target}`}
              className="capitalize hover:underline"
            >
              {segment.replaceAll("-", " ")}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
