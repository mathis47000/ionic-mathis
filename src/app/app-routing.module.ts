import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./components/task-list/task-list.component')
      .then(m => m.TaskListComponent)
  },
  {
    path: 'tasks/new',
    loadComponent: () => import('./components/task-create/task-create.component')
      .then(m => m.TaskFormComponent)
  },
  {
    path: 'tasks/:id/edit',
    loadComponent: () => import('./components/task-create/task-create.component')
      .then(m => m.TaskFormComponent)
  },
  {
    path: 'tasks/:id',
    loadComponent: () => import('./components/task-detail/task-detail.component')
      .then(m => m.TaskDetailComponent)
  },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }