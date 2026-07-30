"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Category } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, Tag, Trash2, Lock } from "lucide-react";

const schema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  icon: z.string().default("tag"),
});
type FormInput = z.infer<typeof schema>;

const PRESET_COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6",
  "#8b5cf6", "#ef4444", "#14b8a6", "#f97316", "#84cc16",
];

interface Props {
  categories: Category[];
  expenseCounts: Record<string, number>;
  orgId: string;
}

export function CategoriesClient({ categories, expenseCounts, orgId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } =
    useForm<FormInput>({ resolver: zodResolver(schema), defaultValues: { color: PRESET_COLORS[0] } });

  async function onSubmit(data: FormInput) {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Failed");
    } else {
      reset();
      setSelectedColor(PRESET_COLORS[0]);
      setOpen(false);
      router.refresh();
    }
  }

  async function deleteCategory(id: string) {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Category</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Create Category</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}
              <div className="space-y-1">
                <Label>Name *</Label>
                <Input placeholder="Travel" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`h-7 w-7 rounded-full border-2 transition-all ${selectedColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                      onClick={() => { setSelectedColor(c); setValue("color", c); }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => (
          <Card key={c.id} className="flex items-center gap-3 p-4">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: c.color }}
            >
              {c.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{c.name}</p>
                {c.isSystem && <Lock className="h-3 w-3 text-muted-foreground" />}
              </div>
              <p className="text-xs text-muted-foreground">
                {expenseCounts[c.id] ?? 0} expense{expenseCounts[c.id] !== 1 ? "s" : ""}
              </p>
            </div>
            {!c.isSystem && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground shrink-0"
                onClick={() => deleteCategory(c.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
