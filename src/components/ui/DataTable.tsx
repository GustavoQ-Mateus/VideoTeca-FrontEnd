import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
  /** Rótulo no modo cartão (mobile). Padrão: `header`. Use "" para ocultar o rótulo. */
  mobileLabel?: string;
  /** Oculta a coluna no modo cartão (mobile). */
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  empty?: React.ReactNode;
  zebra?: boolean;
  /** Legenda da tabela (lida por leitores de tela; visível com `captionVisible`). */
  caption?: string;
  captionVisible?: boolean;
  /**
   * Comportamento abaixo de 768px:
   * - "cards" (padrão): cada linha vira um cartão rótulo/valor, sem rolagem horizontal;
   * - "scroll": mantém a tabela com rolagem horizontal acessível por teclado.
   */
  mobileLayout?: "cards" | "scroll";
  className?: string;
}

/**
 * Tabela responsiva com um único DOM (sem duplicar conteúdo).
 * No modo cartão os elementos mudam de `display`; por isso os papéis ARIA de tabela
 * são declarados explicitamente (alguns navegadores descartam a semântica nativa).
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  empty,
  zebra = true,
  caption,
  captionVisible = false,
  mobileLayout = "cards",
  className,
}: DataTableProps<T>) {
  if (data.length === 0 && empty) return <>{empty}</>;

  const cards = mobileLayout === "cards";

  return (
    <div className={cn("rounded-card border border-line bg-surface overflow-hidden", cards && "max-md:border-0 max-md:bg-transparent max-md:rounded-none max-md:overflow-visible", className)}>
      <div
        className={cn("overflow-x-auto", cards && "max-md:overflow-visible")}
        // Contêiner rolável focável para usuários de teclado (WCAG 2.1.1).
        tabIndex={0}
        role="region"
        aria-label={caption ?? "Tabela de dados"}
      >
        <table role="table" className={cn("w-full text-left", cards ? "md:min-w-[640px]" : "min-w-[640px]")}>
          {caption && (
            <caption className={cn(captionVisible ? "text-left px-4 pt-4 pb-2 text-sm font-semibold text-fg" : "sr-only")}>
              {caption}
            </caption>
          )}
          <thead role="rowgroup" className={cn(cards && "max-md:sr-only")}>
            <tr role="row" className="bg-canvas border-b border-line">
              {columns.map((c) => (
                <th
                  key={c.key}
                  role="columnheader"
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-xs font-semibold text-fg-subtle uppercase tracking-wider whitespace-nowrap",
                    c.className
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup" className={cn("divide-y divide-line", cards && "max-md:divide-y-0 max-md:flex max-md:flex-col max-md:gap-3")}>
            {data.map((row, idx) => (
              <tr
                key={rowKey(row)}
                role="row"
                className={cn(
                  "transition-colors hover:bg-canvas/80",
                  zebra && idx % 2 === 1 && "md:bg-surface-subtle",
                  zebra && idx % 2 === 1 && !cards && "bg-surface-subtle",
                  cards && "max-md:block max-md:rounded-card max-md:border max-md:border-line max-md:bg-surface max-md:p-3 max-md:shadow-card"
                )}
              >
                {columns.map((c) => {
                  const label = c.mobileLabel ?? c.header;
                  return (
                    <td
                      key={c.key}
                      role="cell"
                      data-label={label}
                      className={cn(
                        "px-4 py-3 text-sm text-fg",
                        cards &&
                          "max-md:flex max-md:items-start max-md:justify-between max-md:gap-4 max-md:px-1 max-md:py-1.5 max-md:text-right max-md:break-words",
                        cards && label && "max-md:before:content-[attr(data-label)] max-md:before:text-left max-md:before:text-xs max-md:before:font-semibold max-md:before:uppercase max-md:before:tracking-wide max-md:before:text-fg-subtle max-md:before:pt-0.5 max-md:before:flex-shrink-0",
                        cards && c.hideOnMobile && "max-md:hidden",
                        c.className
                      )}
                    >
                      {c.render(row)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
