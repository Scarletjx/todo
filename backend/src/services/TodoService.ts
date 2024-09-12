import { Todo } from "../interfaces/Todo";

// Simulating a database with an in-memory array
let todos: Todo[] = [
  {
    id: 1,
    title: "Buy groceries",
    completed: false,
    description:
      "chocolate, bread, noodles, rice, onions, cabbage, ice, chicken, beef, lamb, carrot",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Read a book",
    completed: true,
    createdAt: "2024-09-02T12:30:00Z",
  },
  {
    id: 3,
    title: "Write TypeScript assignment",
    completed: false,
    createdAt: "2024-09-03T09:00:00Z",
  },
  {
    id: 4,
    title: "Walk the dog",
    completed: false,
    createdAt: "2024-09-04T15:00:00Z",
  },
  {
    id: 5,
    title: "Finish project report",
    completed: false,
    description:
      "plan structure, research topics, write intro, write design, write methodology, write experiments, write results, write conclusion",
    createdAt: "2024-09-05T08:45:00Z",
  },
  {
    id: 6,
    title: "Plan weekend trip",
    completed: true,
    createdAt: "2024-09-05T18:00:00Z",
  },
  {
    id: 7,
    title: "Meditate for 10 minutes",
    completed: true,
    createdAt: "2024-09-06T06:30:00Z",
  },
  {
    id: 8,
    title: "Attend team meeting",
    completed: false,
    createdAt: "2024-09-06T11:00:00Z",
  },
  {
    id: 9,
    title: "Respond to emails",
    completed: false,
    createdAt: "2024-09-06T14:20:00Z",
  },
  {
    id: 10,
    title: "Prepare dinner",
    completed: true,
    createdAt: "2024-09-06T17:45:00Z",
  },
  {
    id: 11,
    title: "Work on open-source project",
    completed: false,
    createdAt: "2024-09-07T09:30:00Z",
  },
  {
    id: 12,
    title: "Clean the house",
    completed: false,
    createdAt: "2024-09-07T13:00:00Z",
  },
  {
    id: 13,
    title: "Watch a documentary",
    completed: true,
    createdAt: "2024-09-07T20:00:00Z",
  },
  {
    id: 14,
    title: "Exercise at the gym",
    completed: false,
    createdAt: "2024-09-08T07:00:00Z",
  },
  {
    id: 15,
    title: "Organize photo album",
    completed: false,
    createdAt: "2024-09-08T10:30:00Z",
  },
  {
    id: 16,
    title: "Research new programming languages",
    completed: true,
    createdAt: "2024-09-08T16:00:00Z",
  },
  {
    id: 17,
    title: "Prepare presentation for conference",
    completed: false,
    createdAt: "2024-09-09T08:15:00Z",
  },
  {
    id: 18,
    title: "Call parents",
    completed: true,
    createdAt: "2024-09-09T19:30:00Z",
  },
  {
    id: 19,
    title: "Review pull requests",
    completed: false,
    createdAt: "2024-09-10T11:00:00Z",
  },
  {
    id: 20,
    title: "Bake cookies",
    completed: false,
    createdAt: "2024-09-10T14:45:00Z",
  },
];

export class TodoService {
  static getAllTodos(): Todo[] {
    return todos;
  }

  static getTodoById(id: number): Todo | undefined {
    return todos.find((todo) => todo.id === id);
  }

  static createTodo(todo: Todo): Todo {
    todos.push(todo);
    return todo;
  }

  static updateTodo(id: number, updatedTodo: Partial<Todo>): Todo | null {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return null;

    todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };
    return todos[todoIndex];
  }

  static deleteTodo(id: number): boolean {
    const originalLength = todos.length;
    todos = todos.filter((todo) => todo.id !== id);
    return todos.length !== originalLength;
  }
}
