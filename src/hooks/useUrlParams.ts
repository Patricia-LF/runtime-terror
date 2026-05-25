"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type UrlParams = {
  identityToken: string | null
  clearIdentityToken: () => void;
};

export function useUrlParams(): UrlParams {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get("identity_token");
  const [identityToken, setIdentityToken] = useState<string | null>(null);

  useEffect(() => {
    // On first load, check for token in URL
    if (urlToken) {
      // Save to localStorage for persistence
      localStorage.setItem("identityToken", urlToken);
      setIdentityToken(urlToken);
    } else {
      // Check localStorage for saved token
      const savedToken = localStorage.getItem("identityToken");
      setIdentityToken(savedToken);
    }
  }, [urlToken]);

  const clearIdentityToken = () => {
    localStorage.removeItem("identityToken");
    setIdentityToken(null);

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete("identity_token");
    window.history.replaceState(null, "", nextUrl.pathname + nextUrl.search);
  };

  return {
    identityToken,
    clearIdentityToken,
  };
}