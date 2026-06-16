import dynamic from "next/dynamic";

const DynamicOverviewTab = dynamic(() => import("../components/OverviewTab"), {
  ssr: false,
});
export default function OverviewPage() {
  return <DynamicOverviewTab />;
}
