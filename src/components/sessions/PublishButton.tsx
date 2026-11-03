"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { request, message } from "@/lib/sprint-api";
export function PublishButton({
  id,
  published,
  onChange,
}: {
  id: number;
  published: boolean;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function toggle() {
    setBusy(true);
    setError("");
    try {
      await request(`/staff/sessions/${id}/publication`, {
        method: "PUT",
        body: JSON.stringify({ published: !published }),
      });
      onChange();
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <Button variant="outline" onClick={toggle} loading={busy}>
        {published ? "Despublicar" : "Publicar"}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
