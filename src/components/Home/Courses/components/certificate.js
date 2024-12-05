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

 // Imágenes decorativas
 if (izquierdaarriba) {
  doc.addImage(izquierdaarriba, "PNG", -11, -2, 30, 34);
}
if (derechaabajo) {
  doc.addImage(derechaabajo, "PNG", 9, -8, 30, 36.2);
 }
 // Configuración de fuentes
 doc.setFont("Arial", "normal");

 // Título principal
 doc.setTextColor(0, 0, 0);
 doc.setFontSize(70);
 doc.text("BRIGHTMIND", 14, 7, { align: "center" });

 // Subtítulo
 doc.setFontSize(25);
 doc.text("HACE CONSTANCIA A", 14, 8, { align: "center" });

 // Logo
 if (insigniaa) {
   doc.addImage(insigniaa, "PNG", 22, 4, 4, 4);
 }

 // Texto del certificado
 doc.setFont("times", "bold");
 doc.setFontSize(18);
 doc.text("Con No. Documento 1.001.000.000 'Por haber completado exitosamente el curso' ", 14, 13.0, { align: "center" });

 // Nombre del usuario
 doc.setFontSize(65);
 doc.setFont("Arial", "normal");
 doc.text(`${username}`, 14, 11, { align: "center" });

 // Línea decorativa
 doc.setLineWidth(0.1);
 doc.setDrawColor(0, 0, 0);
 doc.line(8, 12, 20, 12 );
 // linea entre texto
 doc.setLineWidth(0.1);
 doc.setDrawColor(0, 0, 0);
 doc.line(8, 16, 20, 16);
 // 3 Línea decorativa al lado de la dorada
 doc.setLineWidth(0.1);
 doc.setDrawColor(0, 0, 0);
 doc.line(8.8, 0.9, 32, 0.9);
 // 4 linea decorativa
 doc.setLineWidth(0.1);
 doc.setDrawColor(255, 225, 180);
 doc.line(8.8, 1, 28, 1);
 // Línea decorativa dorada y más gruesa 
  doc.setLineWidth(-0.5);  // Aumenta el grosor de la línea
  doc.setDrawColor(255, 215, 0);  // Color dorado (RGB)
  doc.line(8.8, 0.8, 32, 0.8);  // Dibuja la línea

  // 3 Línea decorativa al lado de la dorada (negra, delgada y vertical)
  doc.setLineWidth(0.1);
  doc.setDrawColor(0, 0, 0);  // Color negro
  doc.line(1.5, 14.5, 1.5, 24);  // Línea vertical (cambia las coordenadas Y para la altura)

  // 4 Línea decorativa (naranja claro y vertical)
  doc.setLineWidth(0.1);  // Grosor de línea delgada
  doc.setDrawColor(255, 225, 180);  // Color naranja claro
  doc.line(1.6, 14.5, 1.6, 24);  // Línea vertical

  // Línea decorativa dorada y más gruesa (vertical)
  doc.setLineWidth(0.1);  // Aumenta el grosor de la línea
  doc.setDrawColor(255, 215, 0);  // Color dorado (RGB)
  doc.line(1.4, 14.5, 1.4, 24);  // Línea vertical (con más grosor)


  // Texto descriptivo
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text(
    `"${courseTitle}"
      Agradecemos tu dedicación y esfuerzo. ¡Continúa aprendiendo y alcanzando nuevas metas!
      21 de Noviembre de 2024`,
    14,14,
    { align: "center" }
  );
 
  // Pie de página
  doc.setTextColor(192, 192, 192);
  doc.text("Este certificado fue generado automáticamente.", 14, 19.5, {
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
    doc.setFontSize(35);
    doc.text("BRIGHTMIND", 14, 4.5, { align: "center" });

    // Título principal
    doc.setFont("times", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(35);
    doc.text("CONSTANCIA DE APRENDIZAJE", 14, 5.5, { align: "center" });


    // Logo
    if (zorroImage) {
      doc.addImage(zorroImage, "JPEG", 18, 5, 12, 8);
    }

    // Texto del certificado
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text(`Con No. Documento. ${documentNumber}`, 14, 13.0, { align: "center" });

    // Nombre del usuario
    doc.setFontSize(55);
    doc.setFont("times", "bold");
    doc.text(`${username}`, 14, 9.5, { align: "center" });

    // Línea decorativa
    doc.setLineWidth(0.1);
    doc.setDrawColor(0, 0, 0);
    doc.line(6, 10, 22, 10);

    // Texto descriptivo
    doc.setFont("times", "normal");
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
