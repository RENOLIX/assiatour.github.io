import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

export function SignInButton({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const result =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: { data: { name, role: "client" } },
            });
      if (result.error) throw result.error;
      toast.success(mode === "signin" ? "Connexion réussie." : "Compte créé.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {mode === "signup" && (
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom complet" />
        )}
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" type="password" />
        <Button onClick={submit} disabled={loading || !email || !password} className="w-full bg-white text-blue-800 hover:bg-blue-50">
          {loading ? "Veuillez patienter..." : mode === "signin" ? "Connexion" : "Créer un compte"}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-sm text-blue-100 underline underline-offset-4"
        >
          {mode === "signin" ? "Créer un compte" : "Déjà un compte ? Connexion"}
        </button>
      </div>
    </div>
  );
}
