import { jsPDF } from "jspdf";
import Anothershabby_trial from "../../../../Tipografy/Anothershabby_trial-normal";

export const generatePremiumCertificatePDF = (username, documentNumber, courseTitle, zorroImage, derechaabajo, izquierdaarriba, estructura) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "cm",
    format: [28, 21.6],
  });

   // Fondo
 doc.setFillColor(255, 255, 255);
 doc.rect(0, 0, 28, 21.6, "F");

 // Imagenes A
 if (estructura) {
  doc.addImage(estructura, "JPEG", 0, -0, 28, 23)
  }
  // Imágenes decorativas
  if (izquierdaarriba) {
    doc.addImage(izquierdaarriba, "JPEG", -9, -3, 25, 20);
  }
  if (derechaabajo) {
    doc.addImage(derechaabajo, "JPEG", 12.5, 5, 25, 20);
  }
 // Configuración de fuentes
 doc.setFont("Arial", "normal");

 // Título principal
 doc.setFont("times", "bold");
 doc.setTextColor(0, 0, 0);
 doc.setFontSize(25);
 doc.text("BRIGHTMIND", 14, 4.5, { align: "center" });

 // Título segundario
 doc.setFont("times", "bold");
 doc.setTextColor(0, 0, 0);
 doc.setFontSize(25);
 doc.text("CONSTANCIA DE APRENDIZAJE", 14, 5.5, { align: "center" });


 // Logo
 if (zorroImage) {
  doc.addImage(zorroImage, "JPEG", 18, 5, 12, 8);
  }

  // Texto del certificado
  doc.setFont("times", "normal");
  doc.setFontSize(20);
  doc.text(`Con No. Documento. ${documentNumber}`, 14, 14.0, { align: "center" });

  // Nombre del usuario
  doc.setFontSize(45);
  doc.setFont("times", "bold");
  doc.text(`${username}`, 14, 10, { align: "center" });

  // Línea decorativa
  doc.setLineWidth(0.1);
  doc.setDrawColor(0, 0, 0);
  doc.line(6, 11, 22, 11);

  // Texto descriptivo
  doc.setFont("times", "normal");
  doc.setFontSize(20);
  doc.text(
    `Por completar exitosamente el curso "${courseTitle}". `,
    14,
    15.0,
    { align: "center" }
  );

  doc.setFontSize(20);
  doc.text("Gracias por tu dedicación y esfuerzo. ¡Sigue aprendiendo y mejorando!", 14, 16.0, {
    align: "center",
  });

  doc.save(`Certificado_${courseTitle}.pdf`);
  
};

export const generateCertificatePreview = async (username, documentNumber, courseTitle, zorroImage, derechaabajo, izquierdaarriba, estructura, isCompleted = false) => {
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "cm",
      format: [28, 21.6],
    });

    // Fondo
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 28, 21.6, "F");

    // Imagenes A
    if (estructura) {
      doc.addImage(estructura, "JPEG", 0, -0, 28, 23)
    }
    // Imágenes decorativas
    if (izquierdaarriba) {
      doc.addImage(izquierdaarriba, "JPEG", -9, -3, 25, 20);
    }
    if (derechaabajo) {
      doc.addImage(derechaabajo, "JPEG", 12.5, 5, 25, 20);
    }

    // Configuración de fuentes
    doc.setFont("Arial", "normal");

    // Título principal
    doc.setFont("times", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(25);
    doc.text("BRIGHTMIND", 14, 4.5, { align: "center" });

    // Título segundario
    doc.setFont("times", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(25);
    doc.text("CONSTANCIA DE APRENDIZAJE", 14, 5.5, { align: "center" });


    // Logo
    if (zorroImage) {
      doc.addImage(zorroImage, "JPEG", 18, 5, 12, 8);
    }

    // Texto del certificado
    doc.setFont("times", "normal");
    doc.setFontSize(20);
    doc.text(`Con No. Documento. ${documentNumber}`, 14, 14.0, { align: "center" });

    // Nombre del usuario
    doc.setFontSize(45);
    doc.setFont("times", "bold");
    doc.text(`${username}`, 14, 10, { align: "center" });

    // Línea decorativa
    doc.setLineWidth(0.1);
    doc.setDrawColor(0, 0, 0);
    doc.line(6, 11, 22, 11);

    // Texto descriptivo
    doc.setFont("times", "normal");
    doc.setFontSize(20);
    doc.text(
      `Por completar exitosamente el curso "${courseTitle}". `,
      14,
      15.0,
      { align: "center" }
    );

    doc.setFontSize(20);
    doc.text("Gracias por tu dedicación y esfuerzo. ¡Sigue aprendiendo y mejorando!", 14, 16.0, {
      align: "center",
    });

    // Agregar marcas de agua si el curso no está completado
    if (!isCompleted) {
      doc.setGState(new doc.GState({ opacity: 0.6 })); // Reducimos la opacidad a 0.6 (60%)
      
      doc.setTextColor(100, 149, 237);
      doc.setFontSize(40);
      doc.setFont("helvetica", "bold");
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
      doc.setGState(new doc.GState({ opacity: 1 }));
    }
    return doc.output('arraybuffer');
  } catch (error) {
    console.error('Error generando el certificado:', error);
    throw error;
  }
};
