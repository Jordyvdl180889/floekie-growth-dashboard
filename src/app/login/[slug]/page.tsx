import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PasswordGate } from "@/components/PasswordGate";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LoginPage({ params }: Props) {
  const { slug } = await params;

  const session = await getSession();
  if (session?.slug === slug) {
    redirect(`/${slug}`);
  }

  const client = await prisma.client.findUnique({
    where: { slug },
    select: { name: true, slug: true, brandPrimary: true },
  });

  if (!client) {
    notFound();
  }

  return (
    <PasswordGate
      slug={client.slug}
      clientName={client.name}
      brandPrimary={client.brandPrimary}
    />
  );
}
