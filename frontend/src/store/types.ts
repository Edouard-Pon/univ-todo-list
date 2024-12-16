export interface User {
  _id: string;
  email: string;
}

export interface Enterprise {
  _id: string;
  name: string;
  address: string;
  email: string;
  teams: Team[];
}

export interface Task {
  _id: string;
  name: string;
  status: boolean;
  startDate: Date;
  dueDate: Date;
}

export interface Team {
  _id: string;
  name: string;
  workers: string[];
  tasks: Task[];
}
