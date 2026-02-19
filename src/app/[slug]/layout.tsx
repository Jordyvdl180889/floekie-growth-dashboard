import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileNav } from "@/components/MobileNav";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function DashboardLayout({ children, params }: Props) {
  const { slug } = await params;

  const session = await getSession();
  if (!session || session.slug !== slug) {
    redirect(`/login/${slug}`);
  }

  const client = await prisma.client.findUnique({
    where: { slug },
    select: { name: true, slug: true, brandPrimary: true },
  });

  if (!client) {
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        slug={client.slug}
        clientName={client.name}
        brandPrimary={client.brandPrimary}
      />
      <div className="flex-1 flex flex-col">
        <MobileNav
          slug={client.slug}
          clientName={client.name}
          brandPrimary={client.brandPrimary}
        />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
