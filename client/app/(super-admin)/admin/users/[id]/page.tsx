import type { Metadata } from "next";
import { UserDetailView } from "./components/UserDetailView";

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Promise<Metadata> {
  return { title: `User ${params.userId} · Gravitas Admin` };
}

export default function UserDetailPage({ params }: { params: { userId: string } }) {
  return <UserDetailView userId={params.userId} />;
}
