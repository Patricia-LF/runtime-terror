import HauntedHouseShell from "@/components/rooms/HauntedHouseShell";
import { ACCESS_COOKIE_NAME, ACCESS_COOKIE_VALUE } from "@/lib/accessCookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type HauntedHouseLayoutProps = {
  children: React.ReactNode;
};

export default async function HauntedHouseLayout({ children }: HauntedHouseLayoutProps) {

  const cookieStore = await cookies();

  const accessGranted =
    cookieStore.get(ACCESS_COOKIE_NAME)?.value === ACCESS_COOKIE_VALUE;

  if (!accessGranted) {
    redirect("/");
  }
  return (
    <HauntedHouseShell>
      {children}
    </HauntedHouseShell>
  );
}