// CertificateGenerator.js
import { jsPDF } from "jspdf";


export const generatePremiumCertificatePDF = (
  username,
  courseTitle,
  zorroImage,
  derechaabajo,
  izquierdaarriba
) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "cm",
    format: [28, 21.6],
  });
  doc.setFillColor(240, 248, 255);
  doc.rect(0, 0, 28, 21.6, "F");

  if (izquierdaarriba) {
    doc.addImage(izquierdaarriba, "JPEG", -1, -1, 10, 10);
  }
  if (derechaabajo) {
    doc.addImage(derechaabajo, "JPEG", 19, 13, 10, 10);
  }

  // eslint-disable-next-line no-undef
  doc.addFileToVFS("Anothershabby.ttf", Anothershabby_trial);
  doc.addFont("Anothershabby.ttf", "AnotherShabby", "normal");
  doc.setFont("AnotherShabby");

  doc.setFontSize(70);
  doc.setTextColor(0, 0, 0);
  doc.text("CONSTANCIA", 14, 4.5, { align: "center" });

  doc.setFontSize(25);
  doc.text("De aprendizaje", 18, 5.5, { align: "center" });

  if (zorroImage) {
    doc.addImage(zorroImage, "JPEG", 12, 7, 4, 4);
  }

  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("ESTE CERTIFICADO SE OTORGA A", 14, 13.0, { align: "center" });

  doc.setFontSize(65);
  doc.setFont("AnotherShabby", "normal");
  doc.text(`${username}`, 14, 15.5, { align: "center" });

  doc.setLineWidth(0.1);
  doc.setDrawColor(0, 0, 0);
  doc.line(6, 16, 22, 16);

  doc.setFontSize(14);
  doc.text(
    `Por completar exitosamente el curso "${courseTitle}". `,
    14,
    17.5,
    { align: "center" }
  );

  doc.setFontSize(14);
  doc.text("Gracias por tu dedicación y esfuerzo. ¡Sigue aprendiendo y mejorando!", 14, 18.0, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.setTextColor(192, 192, 192);
  doc.text("Este certificado fue generado automáticamente.", 14, 19.5, {
    align: "center",
  });

  doc.save(`Certificado_${courseTitle}.pdf`);
};
