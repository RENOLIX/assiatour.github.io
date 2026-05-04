import { AuthProvider } from "@/components/providers/auth.tsx";
import { ThemeProvider } from "@/components/providers/theme.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

export function DefaultProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
