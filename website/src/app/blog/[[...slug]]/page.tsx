import { notFound } from "next/navigation";

import BlogDirectoryPage from "@/components/blog/BlogDirectoryPage";
import BlogNotePage from "@/components/blog/BlogNotePage";
import { getDirectoryContents, getNote } from "@/lib/blog";

type BlogPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export const dynamic = "force-dynamic";

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug = [] } = await params;

  const directory = await getDirectoryContents(slug);

  if (directory) {
    return <BlogDirectoryPage directory={directory} slug={slug} />;
  }

  const note = await getNote(slug);

  if (!note) {
    notFound();
  }

  return <BlogNotePage note={note} parentSlug={slug.slice(0, -1)} />;
}
