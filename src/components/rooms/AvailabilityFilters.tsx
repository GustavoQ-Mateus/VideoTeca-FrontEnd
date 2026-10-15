"use client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
export type Filters = { date: string; capacity: number; resources: string };
export function AvailabilityFilters({
  value,
  onChange,
  onSearch,
  loading,
}: {
  value: Filters;
  onChange: (value: Filters) => void;
  onSearch: () => void;
  loading: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Data da reserva"
        type="date"
        value={value.date}
        required
        onChange={(e) => onChange({ ...value, date: e.target.value })}
      />
      <Input
        label="Capacidade mínima"
        type="number"
        min={1}
        max={10000}
        value={value.capacity}
        onChange={(e) =>
          onChange({ ...value, capacity: Number(e.target.value) })
        }
      />
      <Input
        label="Recursos necessários"
        helper="Separe por vírgula, como no cadastro da sala"
        value={value.resources}
        placeholder="Projetor, Som"
        onChange={(e) => onChange({ ...value, resources: e.target.value })}
      />
      <Button
        type="button"
        onClick={onSearch}
        loading={loading}
        disabled={!value.date || value.capacity < 1}
      >
        Consultar horários
      </Button>
    </div>
  );
}
