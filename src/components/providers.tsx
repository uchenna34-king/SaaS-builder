"use client";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    // `session` is hydrated from the server (root layout) so the provider never
    // fires a /api/auth/session request on mount. refetchOnWindowFocus={false}
    // stops it from re-hitting that endpoint every time the browser tab regains
    // focus — that focus-refetch storm was what throttled navigation.
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
