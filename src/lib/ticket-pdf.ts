/* ================================================================
   Worship Gift — Génération PDF des billets (client)
   jsPDF + qrcode importés en lazy (libs lourdes). Un billet par page,
   avec QR code scannable à l'entrée.
   ================================================================ */

export interface PdfTicket {
  ticket_code: string;
  event_title: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  ticket_type?: string;
}

export async function generateTicketsPdf(opts: {
  orderId: string;
  customerName?: string;
  tickets: PdfTicket[];
}): Promise<void> {
  const { orderId, customerName, tickets } = opts;
  if (tickets.length === 0) return;

  const [{ jsPDF }, QRCodeMod] = await Promise.all([
    import("jspdf"),
    import("qrcode"),
  ]);
  const QRCode = QRCodeMod.default;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const gold = [201, 168, 76] as const;

  for (let i = 0; i < tickets.length; i++) {
    const t = tickets[i];
    if (i > 0) doc.addPage();

    // Bandeau titre
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, pageW, 30, "F");
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Worship Gift", pageW / 2, 19, { align: "center" });

    // Cadre billet
    const left = 20;
    let y = 48;
    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(t.event_title || "Événement", left, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    y += 10;
    if (t.event_date || t.event_time) {
      doc.text(`Date : ${[t.event_date, t.event_time].filter(Boolean).join(" à ")}`, left, y);
      y += 7;
    }
    if (t.event_location) {
      doc.text(`Lieu : ${t.event_location}`, left, y);
      y += 7;
    }
    if (t.ticket_type) {
      doc.text(`Type : ${t.ticket_type}`, left, y);
      y += 7;
    }
    if (customerName) {
      doc.text(`Titulaire : ${customerName}`, left, y);
      y += 7;
    }

    // QR code
    const qrDataUrl = await QRCode.toDataURL(t.ticket_code, {
      width: 400,
      margin: 1,
      errorCorrectionLevel: "M",
    });
    const qrSize = 60;
    const qrX = (pageW - qrSize) / 2;
    doc.addImage(qrDataUrl, "PNG", qrX, y + 6, qrSize, qrSize);

    // Code sous le QR
    doc.setFont("courier", "normal");
    doc.setFontSize(11);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text(t.ticket_code, pageW / 2, y + qrSize + 16, { align: "center" });

    // Pied
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Réf. commande : ${orderId} — Billet ${i + 1}/${tickets.length}`,
      pageW / 2,
      y + qrSize + 26,
      { align: "center" },
    );
    doc.text(
      "Présentez ce QR code à l'entrée. Billet valable une seule fois.",
      pageW / 2,
      y + qrSize + 32,
      { align: "center" },
    );
  }

  doc.save(`billets-worship-gift-${orderId}.pdf`);
}
