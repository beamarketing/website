export default function InsightDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Insight Detail</h2>
      <p className="text-sm text-gray-500">
        TODO Milestone 5: Detail view for insight {params.id}.
      </p>
    </div>
  );
}
