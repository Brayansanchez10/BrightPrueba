import { jsPDF } from "jspdf";
import Anothershabby_trial from "../../../../Tipografy/Anothershabby_trial-normal";

export const generatePremiumCertificatePDF = (username, courseTitle, zorroImage, derechaabajo, izquierdaarriba) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "cm",
    format: [28, 21.6],
  });

  // Fondo
  doc.setFillColor(240, 248, 255);
  doc.rect(0, 0, 28, 21.6, "F");

  // Imágenes decorativas
  if (izquierdaarriba) {
    doc.addImage(izquierdaarriba, "JPEG", -1, -1, 10, 10);
  }
  if (derechaabajo) {
    doc.addImage(derechaabajo, "JPEG", 19, 13, 10, 10);
  }

  // Configuración de fuentes
  doc.addFileToVFS("Anothershabby.ttf", Anothershabby_trial);
  doc.addFont("Anothershabby.ttf", "AnotherShabby", "normal");
  doc.setFont("AnotherShabby");

  // Título principal
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(70);
  doc.text("CONSTANCIA", 14, 4.5, { align: "center" });

  // Subtítulo
  doc.setFontSize(25);
  doc.text("De aprendizaje", 18, 5.5, { align: "center" });

  // Logo
  if (zorroImage) {
    doc.addImage(zorroImage, "JPEG", 12, 7, 4, 4);
  }

  // Texto del certificado
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("ESTE CERTIFICADO SE OTORGA A", 14, 13.0, { align: "center" });

  // Nombre del usuario
  doc.setFontSize(65);
  doc.setFont("AnotherShabby", "normal");
  doc.text(`${username}`, 14, 15.5, { align: "center" });

  // Línea decorativa
  doc.setLineWidth(0.1);
  doc.setDrawColor(0, 0, 0);
  doc.line(6, 16, 22, 16);

  // Texto descriptivo
  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.text(
    `Por completar exitosamente el curso "${courseTitle}". `,
    11,
    17.5,
    { align: "center" }
  );
  doc.text("Gracias por tu dedicación y", 19, 17.5, { align: "center" });
  doc.text("esfuerzo. ¡Sigue aprendiendo y mejorando!", 14, 18.0, {
    align: "center",
  });

  // Pie de página
  doc.setTextColor(192, 192, 192);
  doc.text("Este certificado fue generado automáticamente.", 14, 19.5, {
    align: "center",
  });

  doc.save(`Certificado_${courseTitle}.pdf`);
};

export const generateCertificatePreview = async (username, courseTitle, zorroImage, derechaabajo, izquierdaarriba, isCompleted = false) => {
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "cm",
      format: [28, 21.6],
    });

    // Fondo
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 28, 21.6, "F");

    // Imágenes decorativas
    if (izquierdaarriba) {
      doc.addImage(izquierdaarriba, "JPEG", -1, -1, 10, 10);
    }
    if (derechaabajo) {
      doc.addImage(derechaabajo, "JPEG", 19, 13, 10, 10);
    }

    // Configuración de fuentes
    doc.addFileToVFS("Anothershabby.ttf", Anothershabby_trial);
    doc.addFont("Anothershabby.ttf", "AnotherShabby", "normal");
    doc.setFont("AnotherShabby");

    // Título principal
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(70);
    doc.text("CONSTANCIA", 14, 4.5, { align: "center" });

    // Subtítulo
    doc.setFontSize(25);
    doc.text("De aprendizaje", 18, 5.5, { align: "center" });

    // Logo
    if (zorroImage) {
      doc.addImage(zorroImage, "JPEG", 12, 7, 4, 4);
    }

    // Texto del certificado
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("ESTE CERTIFICADO SE OTORGA A", 14, 13.0, { align: "center" });

    // Nombre del usuario
    doc.setFontSize(65);
    doc.setFont("AnotherShabby", "normal");
    doc.text(`${username}`, 14, 15.5, { align: "center" });

    // Línea decorativa
    doc.setLineWidth(0.1);
    doc.setDrawColor(0, 0, 0);
    doc.line(6, 16, 22, 16);

    // Texto descriptivo
    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.text(
      `Por completar exitosamente el curso "${courseTitle}". `,
      11,
      17.5,
      { align: "center" }
    );
    doc.text("Gracias por tu dedicación y", 19, 17.5, { align: "center" });
    doc.text("esfuerzo. ¡Sigue aprendiendo y mejorando!", 14, 18.0, {
      align: "center",
    });

    // Agregar marcas de agua si el curso no está completado
    if (!isCompleted) {
      // Configurar transparencia
      doc.setGState(new doc.GState({ opacity: 0.6 })); // Reducimos la opacidad a 0.6 (60%)
      
      doc.setTextColor(100, 149, 237);
      doc.setFontSize(40);
      doc.setFont("helvetica", "bold");

      // Crear patrón de marcas de agua
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
          const xPos = i * 7;
          const yPos = 3 + j * 7;
          
          doc.text("VISTA PREVIA", xPos, yPos, {
            angle: 45,
            align: "center"
          });
        }
      }

      // Restaurar la opacidad normal para el resto del contenido
      doc.setGState(new doc.GState({ opacity: 1 }));
    }

    // Retornar el PDF como array buffer
    return doc.output('arraybuffer');
  } catch (error) {
    console.error('Error generando el certificado:', error);
    throw error;
  }
};