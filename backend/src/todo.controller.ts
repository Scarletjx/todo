import { Request, Response } from 'express';
import * as todoService from './todo.service';

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await todoService.getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  try {
    const newTodo = await todoService.createTodo(title, description);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completed, title } = req.body;
  try {
    const updatedTodo = await todoService.updateTodo(Number(id), completed, title);
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

export const deleteCompletedTodos = async (req: Request, res: Response) => {
  try {
    await todoService.deleteCompletedTodos();
    res.status(200).json({ message: 'All Completed Todos deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete completed todos' });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await todoService.deleteTodo(Number(id));
    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};