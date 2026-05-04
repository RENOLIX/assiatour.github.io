# Assia Tours

Site React/Vite pour `assiatour.github.io`, avec pages publiques, formulaire de réservation et admin connecté à Supabase.

## Supabase

1. Collez `supabase-schema.sql` dans Supabase SQL Editor.
2. Dans Authentication > Providers > Email, désactivez `Confirm email` pour valider automatiquement les nouveaux utilisateurs.
3. Créez un compte depuis `/admin`, puis exécutez:

```sql
update public.profiles set role = 'admin' where email = 'votre-email@example.com';
```

## Local

```bash
npm install
npm run dev
```
