import { Film } from "lucide-react";

type PosterProps = {
  src?: string | null;
  alt: string;
  /** Classes de tamanho/proporção do bloco (ex.: "w-10 h-14"). */
  className?: string;
  iconClassName?: string;
  width?: number;
  height?: number;
};

/**
 * Cartaz do filme: mostra a capa real quando houver; sem capa, bloco chapado
 * #EBF0FF com o ícone Film em azul UNIFOR.
 */
export function Poster({
  src,
  alt,
  className = "",
  iconClassName = "w-4 h-4",
  width = 200,
  height = 300,
}: PosterProps) {
  return (
    <div
      className={`bg-[#EBF0FF] rounded-[4px] overflow-hidden flex items-center justify-center flex-shrink-0 ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      ) : (
        <Film className={`text-[#004AF7] ${iconClassName}`} aria-hidden />
      )}
    </div>
  );
}
