import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

export function SignInButton({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      toast.success("Connexion réussie.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          type="password"
        />
        <Button onClick={submit} disabled={loading || !email || !password} className="w-full bg-white text-blue-800 hover:bg-blue-50">
          {loading ? "Veuillez patienter..." : "Connexion"}
        </Button>
      </div>
    </div>
  );
}
