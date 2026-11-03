"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrCodeImageProps {
  /** Conteúdo codificado (ex.: URL de check-in). */
  value: string;
  /** Lado em px. */
  size?: number;
  /** Texto alternativo para leitores de tela. */
  label: string;
}

/** QR Code real, gerado no navegador (sem serviço externo). */
export function QrCodeImage({ value, size = 128, label }: QrCodeImageProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(value, { width: size * 2, margin: 1, errorCorrectionLevel: "M", color: { dark: "#0B1B3F", light: "#FFFFFF" } })
      .then((url) => alive && setSrc(url))
      .catch(() => alive && setSrc(null));
    return () => { alive = false; };
  }, [value, size]);

  if (!src) return <span className="block bg-[#F2F5FB] rounded-[4px]" style={{ width: size, height: size }} aria-hidden />;
  // eslint-disable-next-line @next/next/no-img-element -- data URL gerada localmente
  return <img src={src} width={size} height={size} alt={label} className="block rounded-[4px]" />;
}
