import type { Metadata } from "next";
import { SchoolDetailView } from "./components/SchoolDetailView";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const resolveParams = await params
  return { title: `School ${resolveParams.id} · Gravitas Admin` };
}

export default async function SchoolDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  return <SchoolDetailView schoolId={resolvedParams.id} />;
}
