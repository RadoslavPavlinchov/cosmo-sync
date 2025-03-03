export default async function DynamicParams({
  params,
}: {
  params: Promise<{ dynamic: string }>;
}) {
  const dynamicParam = (await params).dynamic;

  return <h1>Dynamic data from url {dynamicParam}</h1>;
}
