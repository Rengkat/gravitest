import type { Metadata } from "next";
import { SchoolDetailView } from "./components/SchoolDetailView";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return { title: `School ${params.id} · Gravitas Admin` };
}

export default function SchoolDetailPage({ params }: { params: { id: string } }) {
  return <SchoolDetailView schoolId={params.id} />;
}
