import jsPDF from 'jspdf';
import hola from "../../../../assets/img/hola.png"

export const generateStudyPlanPDF = (course, courseId, resources, subCategory) => {
  const doc = new jsPDF();
    
  // Configuración de fuente y estilos para header y titulo del curso
  doc.setFont('helvetica', 'bold');
  
  // Header
  // Logo de BrightMind
  doc.addImage(hola, 'PNG', 20, 3, 25, 25);
  
  // Título "PLAN DE ESTUDIO" alineado a la derecha
  doc.setFontSize(16);
  doc.text('PLAN DE ESTUDIO', 190, 18, { align: 'right' });
  
  // Línea horizontal
  doc.setLineWidth(0.3);
  doc.line(20, 30, 190, 30);

  // Título del curso
  doc.setFontSize(20);
  doc.text(`${course.title}`, 105, 45, { align: 'center' });

  // Fuente normal
  doc.setFont('helvetica', 'normal');

  // Contenido del curso
  doc.setFontSize(12);
  doc.text(`ID DEL CURSO:  ${courseId}`, 20, 70);
  doc.text(`DURACIÓN DEL CURSO:  ${course.duracion} horas`, 20, 80);
  doc.text(`CANTIDAD DE RECURSOS:  ${resources.length}`, 20, 90);
  doc.text(`DESCRIPCIÓN DEL CURSO: `, 20, 100);
  
  // Agregar descripción con saltos de línea si es necesario
  const splitDescription = doc.splitTextToSize(course.description, 170);
  doc.text(splitDescription, 20, 110);
  
  // Temáticas
  doc.text('TEMÁTICAS:', 20, 140);
  let yPosition = 150;
  
  subCategory.forEach((category, index) => {
    doc.text(`SECCIÓN ${index + 1}: ${category.title}`, 20, yPosition);
    yPosition += 10;
    
    const categoryResources = resources.filter(
      resource => resource.subcategoryId === category.id
    );
    
    categoryResources.forEach(resource => {
      doc.text(`- RECURSO: ${resource.title}`, 30, yPosition);
      yPosition += 10;
    });
    
    yPosition += 5;
  });
  
  // Pie de página
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('PLATAFORMA EDUCATIVA', 105, 280, { align: 'center' });
  doc.text('COLOMBIA', 105, 285, { align: 'center' });
  
  // Descargar PDF
  doc.save(`plan_estudio_${course.title}.pdf`);
};