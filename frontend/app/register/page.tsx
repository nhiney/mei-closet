import { redirect } from "next/navigation";

export default async function RegisterRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const next = params.next ? `&next=${params.next}` : "";
  redirect(`/login?mode=register${next}`);
}
