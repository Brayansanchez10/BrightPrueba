import jsPDF from "jspdf";
import hola from "../../../assets/img/hola.png"

export const generateNotesPDF = (notes, resourceNotes, resources) => {
  const doc = new jsPDF();
  
  // Configuración inicial y header
  doc.setFont('helvetica', 'bold');
  
  // Logo
  doc.addImage(hola, 'PNG', 20, 3, 25, 25);
  
  // Título principal
  doc.setFontSize(16);
  doc.text('APUNTES DEL CURSO', 190, 18, { align: 'right' });
  
  // Línea separadora
  doc.setLineWidth(0.3);
  doc.line(20, 30, 190, 30);

  // Título del contenido
  let yOffset = 45;
  if (notes.length > 0) {
    doc.setFontSize(20);
    doc.text(notes[0].content, 105, yOffset, { align: "center" });
    yOffset += 20;
  }

  // Contenido de los recursos
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  // Iterar sobre todos los recursos para asegurar que se incluyan incluso los que no tienen notas
  resources.forEach((resource) => {
    const resourceNote = resourceNotes.find(note => note.resourceId === resource.id);
    
    doc.setFont('helvetica', 'bold');
    doc.text(resource.title, 20, yOffset);
    yOffset += 10;

    doc.setFont('helvetica', 'normal');
    const content = resourceNote 
      ? resourceNote.content 
      : "No se agregó información en este recurso";
    
    const splitContent = doc.splitTextToSize(content, 170);
    
    if (yOffset + splitContent.length * 7 > 260) { // Ajustado para dejar espacio al pie de página
      doc.addPage();
      yOffset = 20;
    }

    doc.text(splitContent, 20, yOffset);
    yOffset += splitContent.length * 7 + 15;
  });

  // Pie de página
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PLATAFORMA EDUCATIVA', 105, 280, { align: 'center' });
  doc.text('COLOMBIA', 105, 285, { align: 'center' });

  doc.save("Apuntes_del_curso.pdf");
};
