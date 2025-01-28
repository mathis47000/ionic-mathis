import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportToPdf(task: Task) {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(task.title, 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text(`${task.description}`, 10, 60);
    doc.text(`Status: ${task.status}`, 10, 80);
    doc.text(`Date de création: ${task.createdAt.toUTCString()}`, 10, 100);
    doc.text(`Date d'échéance: ${task.dueDate.toUTCString()}`, 10, 120);
    doc.save(`${task.title}-${new Date().getTime()}.pdf`);
  }


}
