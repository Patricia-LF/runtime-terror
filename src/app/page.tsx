import { Suspense } from "react";
import HomeClient from "@/components/home-page/home-client";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Home() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomeClient />
    </Suspense>
  );
}
