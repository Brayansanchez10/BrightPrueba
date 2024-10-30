import jsPDF from "jspdf";
import zorro from "../../../assets/img/Zorro.jpeg";
import derechaabajo from "../../../assets/img/DerechaAbajo.jpeg";
import izquierdaarriba from "../../../assets/img/IzquierdaArriba.jpeg";
import { Anothershabby_trial } from "../../../Tipografy/Anothershabby_trial-normal";

export const generatePremiumCertificatePDF = (username, courseTitle) => {
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

  doc.addFileToVFS("Anothershabby.ttf", Anothershabby_trial);
  doc.addFont("Anothershabby.ttf", "AnotherShabby", "normal");
  doc.setFont("AnotherShabby");

  doc.setFont("AnotherShabby", "normal");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(70);
  doc.text("CONSTANCIA", 14, 4.5, { align: "center" });

  doc.setFontSize(25);
  doc.setFont("AnotherShabby", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("De aprendizaje", 18, 5.5, { align: "center" });

  if (zorro) {
    doc.addImage(zorro, "JPEG", 12, 7, 4, 4);
  }

  doc.setFont("times", "bold");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text("ESTE CERTIFICADO SE OTORGA A", 14, 13.0, { align: "center" });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(65);
  doc.setFont("AnotherShabby", "normal");
  doc.text(`${username}`, 14, 15.5, { align: "center" });

  doc.setLineWidth(0.1);
  doc.setDrawColor(0, 0, 0);
  doc.line(6, 16, 22, 16);

  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(
    `Por completar exitosamente el curso "${courseTitle}". `,
    11,
    17.5,
    { align: "center" }
  );

  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Gracias por tu dedicación y", 19, 17.5, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("esfuerzo. ¡Sigue aprendiendo y mejorando!", 14, 18.0, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.setTextColor(192, 192, 192);
  doc.text("Este certificado fue generado automáticamente.", 14, 19.5, {
    align: "center",
  });

  doc.save(`Certificado_${courseTitle}.pdf`);
};