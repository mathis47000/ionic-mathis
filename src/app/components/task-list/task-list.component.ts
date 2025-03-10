// components/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { DateDiffPipe } from 'src/app/services/data.pipeline';
import { ExportService } from 'src/app/services/export.service';

@Component({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, DateDiffPipe],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Mes Tâches</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/tasks/new">
            <ion-icon name="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-searchbar [(ngModel)]="searchTerm" placeholder="Rechercher une tâche"></ion-searchbar>
      <ion-list>
        <ion-item-sliding *ngFor="let task of filteredTasks()">
          <ion-item [routerLink]="['/tasks', task.id]">
            <ion-label>
              <h2>{{ task.title }}</h2>
              <p>{{ task.description }}</p>
              <p class="ion-text-end">
                <small>Date de création: {{ task.createdAt | date }}</small>
              </p>
            </ion-label>
            <ion-badge slot="end" [color]="isTaskOverdue(task.dueDate) ? 'danger' : 'success'">
              {{ task.dueDate | dateDiff }}
            </ion-badge>
            <ion-badge slot="end">{{ task.status }}</ion-badge>

          </ion-item>
          <ion-item-options side="end"> 
            <ion-item-option color="danger" (click)="deleteTask(task)">Supprimer</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  `
})
export class TaskListComponent implements OnInit {
  searchTerm = '';
  tasks : Task[] = [];

  constructor(private taskService: TaskService, private exportService: ExportService) {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  async ngOnInit() {
    await this.exportService.requestStoragePermission();
  }

  filteredTasks(): Task[] {
    return this.tasks.filter(task =>
      task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  async deleteTask(task: Task) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Confirmation';
    alert.message = 'Voulez-vous vraiment supprimer cette tâche ?';
    alert.buttons = [
      {
        text: 'Annuler',
        role: 'cancel'
      },
      {
        text: 'Supprimer',
        role: 'confirm',
        handler: () => {
          this.taskService.deleteTask(task.id);
        }
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }
  isTaskOverdue(taskDueDate: string | Date): boolean {
    return new Date(taskDueDate) < new Date();
  }
  
}