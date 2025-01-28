import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { jsPDF } from 'jspdf';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  isAndroid: boolean;

  constructor(private platform: Platform, private androidPermissions: AndroidPermissions, private file: File, private fileOpener: FileOpener) {
    this.isAndroid = this.platform.is('android');
  }

  async exportToPdf(task: Task) {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal"); 
    doc.setFontSize(22);
    doc.text(task.title, 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text(`${task.description}`, 10, 60);
    doc.text(`Status: ${task.status}`, 10, 80);
    doc.text(`Date de création: ${task.createdAt.toUTCString()}`, 10, 100);
    doc.text(`Date d'échéance: ${task.dueDate.toUTCString()}`, 10, 120);

    // Convert PDF to Base64
    const base64Data = doc.output('datauristring').split(',')[1]; // Remove prefix
    const binaryData = this.base64ToUint8Array(base64Data);
    const fileName = `Download/${task.title}.pdf`;
    if (this.isAndroid) {
      // Save PDF to external storage
      await this.file.writeFile(this.file.externalRootDirectory, fileName, binaryData, { replace: true }).then(() => {
        alert('Fichier PDF exporté avec succès !');
      }).catch((err) => {
        alert('Erreur lors de l\'exportation du fichier PDF :' + err);
      });
    } else {
      doc.save(fileName);
    }
  }

  async requestStoragePermission() {
    if (!this.isAndroid) {
      return;
    }
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then((result) => {
        if (!result.hasPermission) {
          // Demander la permission si elle n'est pas encore accordée
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then(() => {
              console.log('Permission accordée !');
            })
            .catch(() => {
              alert('Permission refusée');
            });
        } else {
          console.log('Permission déjà accordée');
        }
      })
      .catch((err) => {
        alert('Erreur lors de la vérification des permissions :' + err);
      });
  }

  // Convert Base64 to Uint8Array
  base64ToUint8Array(base64: string): string {
    return atob(base64);
  }
}