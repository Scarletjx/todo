import Todo from './todo.model';

export const getAllTodos = async () => {
  return await Todo.findAll();
};

export const createTodo = async (title: string, description?: string) => {
  return await Todo.create({ title, description });
};

export const updateTodo = async (id: number, completed: boolean, title?: string) => {
  const todo = await Todo.findByPk(id);
  if (!todo) throw new Error('Todo not found');
  
  todo.completed = completed;
  if (title) todo.title = title;
  return await todo.save();
};

export const deleteTodo = async (id: number) => {
  const todo = await Todo.findByPk(id);
  if (!todo) throw new Error('Todo not found');

  return await todo.destroy();
};