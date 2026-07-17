import StatusPageClient from "../_components/StatusPageClient";

export default async function Page({ params }) {
  const { slug } = await params;

  return <StatusPageClient slug={slug} />;
}