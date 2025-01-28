import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TaskService } from 'src/app/services/task.service';
import { ExportService } from 'src/app/services/export.service';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tasks"></ion-back-button>
        </ion-buttons>
        <ion-title>Détail de la tâche</ion-title>
        <!-- Export to pdf -->
        <ion-buttons slot="end">
          <ion-button (click)="exportToPdf()">
            export PDF &nbsp;
            <ion-icon name="arrow-redo-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ task.title }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>{{ task.description }}</p>
          <p>Date de création: {{ task.createdAt | date }}</p>
          <p>Date d'échéance: {{ task.dueDate | date }}</p>
          <ion-badge slot="end">{{ task.status }}</ion-badge>
          <ion-button routerLink="/tasks/{{ task.id }}/edit" expand="block" class="ion-margin-top">
            Modifier
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
    `
})
export class TaskDetailComponent  implements OnInit {
  
  id = Number.parseInt(this.route.snapshot.paramMap.get('id')?.toString() || '');
  task : Task = {
    id: 0,
    title: 'Not Found',
    description: '',
    status: 'À faire',
    createdAt: new Date(),
    dueDate: new Date()
  };
  constructor(private taskService: TaskService, private route: ActivatedRoute, private exportService: ExportService) { }

  ngOnInit() {
    this.taskService.getTaskById(this.id).subscribe(task => {
      if (task) {
        this.task = task;
      }
    })
  }
  exportToPdf() {
    this.exportService.exportToPdf(this.task);
  }

}
