import { getCatalogFilms } from "@/lib/films";
import { PublicCatalogClient } from "./CatalogoClient";

export default async function PublicCatalogPage() {
  const films = await getCatalogFilms();
  return <PublicCatalogClient initialFilms={films} />;
}
