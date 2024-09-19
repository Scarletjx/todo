import { useState, useEffect } from "react";
import { Todo } from "../App";
import {
  fetchTodos as apiFetchTodos,
  createTodo as apiCreateTodo,
  updateTodo as apiUpdateTodo,
  deleteTodo as apiDeleteTodo,
  deleteAllCompletedTodos as apiDeleteAllCompletedTodos,
} from "../todoService";

export interface UseTodosReturn {
  incompleteTodos: Todo[];
  completedTodos: Todo[];
  createTodo: (newTodo: Todo) => Promise<void>;
  updateTodo: (id: number, updatedData: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  completeTodo: (id: number, completed: boolean) => Promise<void>;
  deleteAllCompletedTodos: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  onDragEnd: (result: any) => void;
}

export const useTodos = (): UseTodosReturn => {
  const [incompleteTodos, setIncompleteToDos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedToDos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await apiFetchTodos();
        const todos = response.data;
        const incomplete = todos.filter((todo: Todo) => !todo.completed);
        const completed = todos.filter((todo: Todo) => todo.completed);
        setIncompleteToDos(incomplete);
        setCompletedToDos(completed);
      } catch (err) {
        setError(`Error fetching todos: ${err}`);
      }
    };
    fetchTodos();
  }, []);

  const createTodo = async (newTodo: Todo) => {
    try {
      const response = await apiCreateTodo(newTodo);
      setIncompleteToDos([...incompleteTodos, response.data]);
    } catch (err) {
      setError(`Error creating todo: ${err}`);
    }
  };

  const updateTodo = async (id: number, updatedData: Partial<Todo>) => {
    try {
      await apiUpdateTodo(id, updatedData);
      setIncompleteToDos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, ...updatedData } : todo
        )
      );
    } catch (err) {
      setError(`Error updating todo: ${err}`);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await apiDeleteTodo(id);
      setIncompleteToDos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== id)
      );
      setCompletedToDos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== id)
      );
    } catch (err) {
      setError(`Error deleting todo: ${err}`);
    }
  };

  const completeTodo = async (id: number, completed: boolean) => {
    const targetTodo = completed
      ? incompleteTodos.find((todo) => todo.id === id)
      : completedTodos.find((todo) => todo.id === id);

    if (!targetTodo) return;

    try {
      await apiUpdateTodo(id, { ...targetTodo, completed });
      if (completed) {
        setIncompleteToDos(incompleteTodos.filter((todo) => todo.id !== id));
        setCompletedToDos([
          ...completedTodos,
          { ...targetTodo, completed: true },
        ]);
      } else {
        setCompletedToDos(completedTodos.filter((todo) => todo.id !== id));
        setIncompleteToDos([
          ...incompleteTodos,
          { ...targetTodo, completed: false },
        ]);
      }
    } catch (err) {
      setError(`Error toggling todo completion: ${err}`);
    }
  };

  const deleteAllCompletedTodos = async () => {
    try {
      await apiDeleteAllCompletedTodos();
      setCompletedToDos([]);
    } catch (err) {
      setError(`Error deleting all completed todos: ${err}`);
    }
  };

  const reorder = (list: Todo[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (
    source: Todo[],
    destination: Todo[],
    droppableSource: any,
    droppableDestination: any,
    isCompleted: boolean
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    const updatedItem = { ...removed, completed: isCompleted };
    destClone.splice(droppableDestination.index, 0, updatedItem);
    completeTodo(updatedItem.id, updatedItem.completed);

    const result: { [key: string]: Todo[] } = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    // Moving within the same lisst
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "incomplete") {
        const reordered = reorder(
          incompleteTodos,
          source.index,
          destination.index
        );
        setIncompleteToDos(reordered);
      } else if (source.droppableId === "completed") {
        const reordered = reorder(
          completedTodos,
          source.index,
          destination.index
        );
        setCompletedToDos(reordered);
      }
    } else {
      // Moving between lists
      const result = move(
        source.droppableId === "incomplete" ? incompleteTodos : completedTodos,
        source.droppableId === "incomplete" ? completedTodos : incompleteTodos,
        source,
        destination,
        destination.droppableId === "completed"
      );

      setIncompleteToDos(result.incomplete || incompleteTodos);
      setCompletedToDos(result.completed || completedTodos);
    }
  };

  const clearError = () => setError(null);

  return {
    incompleteTodos,
    completedTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    deleteAllCompletedTodos,
    error,
    clearError,
    onDragEnd,
  };
};
