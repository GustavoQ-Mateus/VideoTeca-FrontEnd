"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Heart } from "lucide-react";
import { student as api } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function FavoritosPage() {
  const user = getUser();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => { api.favorites().then(d => d && setFavorites(d)); }, []);

  return (
    <AppShell role="aluno" title="Favoritos" user={{ name: user?.name ?? "", course: user?.course ?? "" }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {favorites.map(f => (
          <Link key={f.id} href={`/aluno/catalogo/${f.id}`}
            className="bg-white rounded-[14px] border border-[#E2E8F0] p-4 flex gap-4 hover:border-[#0066B3]/40 transition-colors">
            <div className="w-12 h-16 bg-gradient-to-b from-[#003A70] to-[#0066B3] rounded-[8px] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#172033] text-sm truncate">{f.title}</p>
              <p className="text-xs text-[#667085]">{f.director} · {f.year}</p>
              <p className="text-xs text-[#667085] mt-1">{f.genre}</p>
              <div className="mt-2"><Badge status={f.status} /></div>
            </div>
          </Link>
        ))}
        {favorites.length === 0 && (
          <div className="col-span-3 py-16 text-center text-[#667085]">
            <Heart className="w-10 h-10 mx-auto mb-3 opacity-20" aria-hidden />
            <p className="text-sm">Nenhum favorito ainda</p>
            <p className="text-xs mt-1">Explore o catálogo e salve seus títulos preferidos</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
