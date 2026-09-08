import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  empty?: React.ReactNode;
  zebra?: boolean;
}

export function DataTable<T>({ columns, data, rowKey, empty, zebra = true }: DataTableProps<T>) {
  if (data.length === 0 && empty) return <>{empty}</>;

  return (
    <div className="rounded-[18px] border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="bg-[#F5F7FA] border-b border-[#E2E8F0]">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-xs font-semibold text-[#667085] uppercase tracking-wider whitespace-nowrap",
                    c.className
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {data.map((row, idx) => (
              <tr
                key={rowKey(row)}
                className={cn(
                  "transition-colors hover:bg-[#F5F7FA]/80",
                  zebra && idx % 2 === 1 && "bg-[#FAFBFC]"
                )}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-3 text-sm text-[#172033]", c.className)}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
