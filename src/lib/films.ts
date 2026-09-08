import type { FilmRecord } from "@/lib/types";
import { fetchCatalogFilms } from "@/lib/api";

export type { FilmRecord };

export async function getCatalogFilms(): Promise<FilmRecord[]> {
  return fetchCatalogFilms();
}
