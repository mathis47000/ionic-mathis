export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'À faire' | 'En cours' | 'Terminé';
    dueDate: Date;
    createdAt: Date;
  }