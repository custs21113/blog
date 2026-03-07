import { type Metadata } from "next";
import { allNotes } from "content-collections";
import Link from "next/link";
import count from 'word-count'
import { config } from "@/lib/config";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Notes | ${config.site.title}`,
  description: `Notes of ${config.site.title}`,
  keywords: `${config.site.title}, notes, ${config.site.title} notes, nextjs note template`,
};

export default function NotePage() {
  const notes = allNotes.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {notes.map((note: any) => (
          <article 
            key={note.slug} 
            className=""
          >
            <Link href={`/note/${note.slug}`}>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold underline underline-offset-4">
                    {note.title}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {formatDate(note.date)} · {count(note.content)} 字
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-2">
                  {note.summary}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}


