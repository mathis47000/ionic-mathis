import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Task } from '../models/task';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = new BehaviorSubject<Task[]>([]);
  private lastId = 0;

  constructor(private storageService: StorageService) {
    this.loadTasks();
  }

  private async loadTasks() {
    const storedTasks = await this.storageService.get('tasks') || [];
    this.tasks.next(storedTasks);
    if (storedTasks.length > 0) {
      this.lastId = storedTasks[storedTasks.length - 1].id;
    }
  }
  
  private async saveTasks() {
    await this.storageService.set('tasks', this.tasks.getValue());
  }

  getTasks(): Observable<Task[]> {
    return this.tasks.asObservable();
  }

  getTaskById(id: number): Observable<Task | undefined> {
    return this.tasks.pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }

  async addTask(taskData: Partial<Task>): Promise<void> {
    const newTask: Task = {
      id: ++this.lastId,
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'À faire',
      createdAt: new Date(),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : new Date()
    };

    const currentTasks = this.tasks.getValue();
    const updatedTasks = [...currentTasks, newTask];
    this.tasks.next(updatedTasks);
    
    await this.saveTasks();
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<void> {
    const currentTasks = this.tasks.getValue();
    const index = currentTasks.findIndex(task => task.id === id);

    if (index > -1) {
      const updatedTask = {
        ...currentTasks[index],
        ...taskData,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : new Date()
      };

      currentTasks[index] = updatedTask;
      this.tasks.next([...currentTasks]);
      
      await this.saveTasks();
    }
  }

  async deleteTask(id: number): Promise<void> {
    const currentTasks = this.tasks.getValue();
    const updatedTasks = currentTasks.filter(task => task.id !== id);
    this.tasks.next(updatedTasks);
    
    await this.saveTasks();
  }
}
