import { useEffect, useState } from "react";
import { Check, ImagePlus, Images, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { supabase, type GalleryBlockPhoto } from "@/lib/supabase.ts";
import { DEFAULT_GALLERY_LINE_1, DEFAULT_GALLERY_LINE_2 } from "@/lib/gallery-photos.ts";
import { useAuth } from "@/hooks/use-auth.ts";

type GalleryLine = "line1" | "line2";

async function uploadGalleryFiles(files: FileList | null) {
  if (!files?.length) return [];
  const urls: string[] = [];
  for (const file of Array.from(files)) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `gallery-block/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("trip-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("trip-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export default function AdminBlocGallerie() {
  const { profile } = useAuth();
  const [line1, setLine1] = useState(DEFAULT_GALLERY_LINE_1);
  const [line2, setLine2] = useState(DEFAULT_GALLERY_LINE_2);
  const [saving, setSaving] = useState(false);

  const canEdit = profile?.role === "admin";

  useEffect(() => {
    if (!canEdit) return;
    supabase
      .from("gallery_block_photos")
      .select("*")
      .order("position", { ascending: true })
      .then(({ data }) => {
        const rows = (data as GalleryBlockPhoto[] | null) ?? [];
        const nextLine1 = rows.filter((item) => item.line === "line1").map((item) => item.image_url);
        const nextLine2 = rows.filter((item) => item.line === "line2").map((item) => item.image_url);
        if (nextLine1.length) setLine1(nextLine1);
        if (nextLine2.length) setLine2(nextLine2);
      });
  }, [canEdit]);

  if (!canEdit) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-blue-950">Acces reserve</h1>
        <p className="mt-2 text-sm text-muted-foreground">Seul un administrateur peut modifier le bloc galerie.</p>
      </div>
    );
  }

  const addPhotos = async (line: GalleryLine, files: FileList | null) => {
    try {
      const urls = await uploadGalleryFiles(files);
      if (!urls.length) return;
      if (line === "line1") setLine1((items) => [...items, ...urls]);
      if (line === "line2") setLine2((items) => [...items, ...urls]);
      toast.success("Photo ajoutee.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload impossible.");
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const rows = [
        ...line1.map((image_url, position) => ({ line: "line1", image_url, position })),
        ...line2.map((image_url, position) => ({ line: "line2", image_url, position })),
      ];
      const { error: deleteError } = await supabase.from("gallery_block_photos").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (deleteError) throw deleteError;
      const { error: insertError } = await supabase.from("gallery_block_photos").insert(rows);
      if (insertError) throw insertError;
      toast.success("Bloc galerie enregistre.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Bloc galerie</h1>
          <p className="mt-1 text-sm text-muted-foreground">Modifiez les photos du bloc "Explorez le Monde" sans melanger les deux lignes.</p>
        </div>
        <Button onClick={save} disabled={saving} className="border-0 bg-gradient-to-r from-blue-600 to-sky-500 text-white">
          <Check className="mr-2 h-4 w-4" />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <GalleryEditor title="Photos ligne 1" photos={line1} onAdd={(files) => addPhotos("line1", files)} onRemove={(index) => setLine1((items) => items.filter((_, i) => i !== index))} />
        <GalleryEditor title="Photos ligne 2" photos={line2} onAdd={(files) => addPhotos("line2", files)} onRemove={(index) => setLine2((items) => items.filter((_, i) => i !== index))} />
      </div>
    </div>
  );
}

function GalleryEditor({
  title,
  photos,
  onAdd,
  onRemove,
}: {
  title: string;
  photos: string[];
  onAdd: (files: FileList | null) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-bold text-blue-950">
          <Images className="h-5 w-5 text-blue-600" />
          {title}
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{photos.length}</span>
        </h2>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
          <ImagePlus className="h-4 w-4" />
          Ajouter
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              onAdd(event.target.files);
              event.currentTarget.value = "";
            }}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo, index) => (
          <div key={`${photo}-${index}`} className="group relative overflow-hidden rounded-xl border border-blue-100 bg-blue-50">
            <img src={photo} alt="" className="h-28 w-full object-cover" />
            <div className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">{index + 1}</div>
            <button onClick={() => onRemove(index)} className="absolute right-2 top-2 rounded-lg bg-white/90 p-1 text-red-500 opacity-0 shadow transition group-hover:opacity-100" aria-label="Supprimer la photo">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
