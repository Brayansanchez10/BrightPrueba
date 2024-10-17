import jsPDF from "jspdf";

export const generateNotesPDF = (notes, resourceNotes, resources) => {
  const doc = new jsPDF();
  let yOffset = 10;

  // Título (contenido del apunte general)
  if (notes.length > 0) {
    doc.setFontSize(20);
    doc.text(notes[0].content, 105, yOffset, { align: "center" });
    yOffset += 20;
  }

  // Apuntes de los recursos
  resourceNotes.forEach((resourceNote) => {
    const resource = resources.find(r => r.id === resourceNote.resourceId);
    const resourceTitle = resource ? resource.title : `Recurso desconocido (ID: ${resourceNote.resourceId})`;

    // Subtítulo (nombre del recurso)
    doc.setFontSize(16);
    doc.text(resourceTitle, 10, yOffset);
    yOffset += 10;

    // Contenido del apunte del recurso
    doc.setFontSize(12);
    const splitContent = doc.splitTextToSize(resourceNote.content, 180);
    
    if (yOffset + splitContent.length * 7 > 280) {
      doc.addPage();
      yOffset = 10;
    }

    doc.text(splitContent, 10, yOffset);
    yOffset += splitContent.length * 7 + 15;
  });

  // Guardar el PDF
  doc.save("Apuntes_del_curso.pdf");
};
