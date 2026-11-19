import jsPDF from 'jspdf';
import { WellnessReportData } from '../types';

export function generateWellnessReportPDF(report: WellnessReportData, personalNote: string, userName: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Background
  doc.setFillColor(30, 37, 48); // Navy
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('FreeSoul Wellness Report', 20, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated for: ${userName || 'Student'} | Date: ${new Date().toLocaleDateString()}`, pageWidth - 20, 25, { align: 'right' });

  let yPos = 55;
  doc.setTextColor(30, 37, 48);

  // Disclaimer Box
  doc.setFillColor(230, 226, 238); // Lavender tint
  doc.roundedRect(20, yPos, pageWidth - 40, 20, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('DISCLAIMER: This report is an AI-assisted summary of self-reported student reflections.', 25, yPos + 8);
  doc.text('It is designed for self-reflection and professional consultation, NOT as a clinical diagnosis.', 25, yPos + 14);

  yPos += 35;

  // Helper function for sections
  const addSection = (title: string, content: string | string[]) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 30;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, 20, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    if (Array.isArray(content)) {
      content.forEach(item => {
        doc.text(`• ${item}`, 25, yPos);
        yPos += 6;
      });
    } else {
      const splitText = doc.splitTextToSize(content, pageWidth - 40);
      doc.text(splitText, 20, yPos);
      yPos += (splitText.length * 6) + 4;
    }
    yPos += 6;
  };

  addSection('1. Executive Emotional Summary', report.summary);
  addSection('2. Mood Patterns & Trajectory', report.moodPatterns);
  addSection('3. Frequently Mentioned Concerns', report.frequentlyMentionedConcerns);
  addSection('4. Observed Triggers & Stressors', report.observedTriggers);
  addSection('5. Positive Coping Mechanisms', report.positiveCoping);
  addSection('6. Suggested Professional Discussion Points', report.suggestedDiscussionPoints);

  if (personalNote) {
    addSection("7. What I Want My Counselor to Know (Student Note)", personalNote);
  }

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`FreeSoul Privacy-First Wellness Platform • Page ${i} of ${pageCount}`, pageWidth / 2, 285, { align: 'center' });
  }

  doc.save(`FreeSoul_Wellness_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}