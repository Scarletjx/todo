import { Router } from 'express';
import { TodoService } from '../services/TodoService';

const router = Router();

// Get all todos
router.get('/todos', (req, res) => {
  const todos = TodoService.getAllTodos();
  res.json(todos);
});

// Get todo by ID
router.get('/todos/:id', (req, res) => {
  const todo = TodoService.getTodoById(parseInt(req.params.id));
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// Create a new todo
router.post('/todos', (req, res) => {
  const { id, title, description, completed, createdAt } = req.body;
  const newTodo = TodoService.createTodo({
    id,
    title,
    description,
    completed: completed || false,
    createdAt
  });
  res.status(201).json(newTodo);
});

// Update a todo by ID
router.put('/todos/:id', (req, res) => {
  const updatedTodo = TodoService.updateTodo(parseInt(req.params.id), req.body);
  if (updatedTodo) {
    res.json(updatedTodo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// Delete a todo by ID
router.delete('/todos/:id', (req, res) => {
  const deleted = TodoService.deleteTodo(parseInt(req.params.id));
  if (deleted) {
    res.json({ message: 'Todo deleted' });
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

export default router;