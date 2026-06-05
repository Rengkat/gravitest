import type { Metadata } from "next";
import { ContentDetailView } from "./components/ContentDetailView";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return { title: `Content · Gravitas Library` };
}

export default function LibraryContentPage({ params }: { params: { id: string } }) {
  return <ContentDetailView contentId={params.id} />;
}
