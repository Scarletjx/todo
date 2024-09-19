import axios from "axios";
import { Todo } from "../App";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "/api/todos"
    : process.env.REACT_APP_API_URL || "http://localhost:5000/api/todos";

export const fetchTodos = () => axios.get(API_URL);

export const createTodo = (newTodo: Todo) => axios.post(API_URL, newTodo);

export const updateTodo = (id: number, updatedData: Partial<Todo>) =>
  axios.put(`${API_URL}/${id}`, updatedData);

export const deleteTodo = (id: number) => axios.delete(`${API_URL}/${id}`);

export const deleteAllCompletedTodos = () =>
  axios.delete(`${API_URL}/completed`);
