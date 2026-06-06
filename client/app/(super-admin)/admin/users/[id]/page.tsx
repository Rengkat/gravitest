import type { Metadata } from "next";
import { UserDetailView } from "./components/UserDetailView";

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Promise<Metadata> {
  return { title: `User ${params.userId} · Gravitas Admin` };
}

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  return <UserDetailView userId={resolvedParams.id} />;
}
