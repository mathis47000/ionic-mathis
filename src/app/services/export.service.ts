import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { jsPDF } from 'jspdf';
import { Platform } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  isAndroid: boolean;

  constructor(private platform: Platform) {
    this.isAndroid = this.platform.is('android');
  }

  async exportToPdf(task: Task) {
    if (this.isAndroid) {
      await this.requestStoragePermission();
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(22);
    doc.text(task.title, 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text(`${task.description}`, 10, 60);
    doc.text(`Status: ${task.status}`, 10, 80);
    doc.text(`Created At: ${task.createdAt.toUTCString()}`, 10, 100);
    doc.text(`Due Date: ${task.dueDate.toUTCString()}`, 10, 120);
  
    const pdfData = doc.output('datauristring').split(',')[1]; // Get Base64 data
    const fileName = `${task.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

    try {
      await Filesystem.writeFile({
        path: fileName,
        data: pdfData,
        directory: Directory.Documents,
        recursive: true
      });
  
      if (this.isAndroid) {
        const filePath = await Filesystem.getUri({
          directory: Directory.Documents,
          path: fileName
        });

        try {
          const fileOpenerOptions: FileOpenerOptions = {
            filePath: filePath.uri,
            contentType: 'application/pdf',
            openWithDefault: true
          };
          await FileOpener.open(fileOpenerOptions);
      } catch (e) {
          alert('Error opening file' + e);
      }
            
      }else{
        doc.save(fileName);
      }
  
      alert('PDF saved successfully!');
  
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Error saving file: ' + JSON.stringify(error));
    }
  }
  
  async requestStoragePermission() {
    // For Android 13+ (API level 33+)
    if (Capacitor.getPlatform() === 'android') {
      try {
        // Check and request permissions using the newer Capacitor Permissions plugin
        await Filesystem.checkPermissions();
        await Filesystem.requestPermissions();
      } catch (error) {
        console.error('Permission error:', error);
        alert('Storage permission is required to save files!');
      }
    }
  }
}