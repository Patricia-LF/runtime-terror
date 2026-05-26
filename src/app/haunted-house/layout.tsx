import HauntedHouseShell from "@/components/rooms/HauntedHouseShell";
import AccessGate from "../../components/shared/AccessGate";
import { ACCESS_COOKIE_NAME, ACCESS_COOKIE_VALUE } from "@/lib/accessCookie";
import { TIVOLI_MODE } from "@/lib/gameConfig";
import { cookies } from "next/headers";

type HauntedHouseLayoutProps = {
  children: React.ReactNode;
};

export default async function HauntedHouseLayout({ children }: HauntedHouseLayoutProps) {

  const cookieStore = await cookies();

  const accessGranted =
    cookieStore.get(ACCESS_COOKIE_NAME)?.value === ACCESS_COOKIE_VALUE;

  if (!accessGranted && TIVOLI_MODE) {
    return <AccessGate>{children}</AccessGate>;
  }
  return (
    <HauntedHouseShell>
      {children}
    </HauntedHouseShell>
  );
}