"use client";

import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function QRCodeCell({ value }: { value: string }) {
  const [open, setOpen] = useState(false);
  const qrRef = useRef<SVGSVGElement | null>(null);

  if (!value) {
    return <span className="text-gray-400 text-sm">N/A</span>;
  }

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current;
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = "qr-code.png";
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <>
      {/* Petit QR cliquable */}
      <div
        className="cursor-pointer flex items-center justify-center"
        onClick={() => setOpen(true)}
      >
        <QRCode value={value} size={64} />
      </div>

      {/* Popup Shadcn */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Code QR</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 p-4">
            <QRCode ref={qrRef} value={value} size={256} />
            <Button onClick={handleDownload} className="w-fit h-10">
              Télécharger le QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
