import PollAnalyticsDetail from "@/components/admin/pollanalyticsdetail";

export default function PollAnalyticsPage({
  params,
}: {
  params: { pollId: string };
}) {
  return (
    <div className="p-6">
      <PollAnalyticsDetail pollId={params.pollId} />
    </div>
  );
}
