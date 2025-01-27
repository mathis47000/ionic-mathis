// components/task-form/task-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tasks"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEditing ? 'Modifier' : 'Nouvelle' }} Tâche</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="ion-padding">
        <ion-list>
          <ion-item>
            <ion-label position="stacked">Titre *</ion-label>
            <ion-input formControlName="title" placeholder="Entrez un titre"></ion-input>
          </ion-item>
          <ion-text color="danger" *ngIf="taskForm.get('title')?.errors?.['required'] && taskForm.get('title')?.touched">
            Le titre est requis
          </ion-text>

          <ion-item>
            <ion-label position="stacked">Description</ion-label>
            <ion-textarea formControlName="description" placeholder="Entrez une description"></ion-textarea>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Statut *</ion-label>
            <ion-select formControlName="status">
              <ion-select-option value="À faire">À faire</ion-select-option>
              <ion-select-option value="En cours">En cours</ion-select-option>
              <ion-select-option value="Terminé">Terminé</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Date limite *</ion-label>
            <ion-datetime displayFormat="DD/MM/YYYY" formControlName="dueDate"></ion-datetime>
          </ion-item>
        </ion-list>

        <ion-button expand="block" type="submit" [disabled]="!taskForm.valid" class="ion-margin-top">
          {{ isEditing ? 'Modifier' : 'Créer' }}
        </ion-button>
      </form>
    </ion-content>
  `
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditing = false;
  taskId?: number;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['À faire', Validators.required],
      dueDate: [new Date().toISOString(), Validators.required]
    });
  }

  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId) {
      this.isEditing = true;
      this.taskService.getTaskById(this.taskId).subscribe(task => {
        if (task) {
          this.taskForm.patchValue({
            ...task,
            dueDate: task.dueDate.toISOString()
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      if (this.isEditing && this.taskId) {
        this.taskService.updateTask(this.taskId, this.taskForm.value);
      } else {
        this.taskService.addTask(this.taskForm.value);
      }
      this.router.navigate(['/tasks']);
    }
  }
}