import request from 'supertest';
import { app } from '../src/app'; 
import sequelize from "../src/dbConfig";
import http from 'http';

let server: http.Server;

beforeAll(async () => {
  // Sync database and start the server before running tests
  await sequelize.sync({ force: true });
  server = app.listen(5000, () => console.log("Test server running on port 5000"));
});

afterAll((done) => {
  // Close the server and the database connection after all tests
  server.close(done);
  sequelize.close();
});

describe('Todos API', () => {
  
  let todoId: string;

  // Test fetching all todos (GET /todos)
  it('should fetch all todos', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test creating a new todo (POST /todos)
  it('should create a new todo', async () => {
    const newTodo = {
      title: 'Test Todo',
      completed: false,
      description: 'This is a test todo'
    };

    const res = await request(app)
      .post('/api/todos')
      .send(newTodo);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual(newTodo.title);

    // Save the new todo's id for later tests
    todoId = res.body.id;
  });

  // Test updating a todo (PUT /todos/:id)
  it('should update an existing todo', async () => {
    const updatedTodo = {
      title: 'Updated Test Todo',
      completed: true,
    };

    const res = await request(app)
      .put(`/api/todos/${todoId}`)
      .send(updatedTodo);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual(updatedTodo.title);
    expect(res.body.completed).toEqual(true);
  });

  // Test deleting a todo (DELETE /todos/:id)
  it('should delete the specified todo', async () => {
    const res = await request(app).delete(`/api/todos/${todoId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Todo deleted');
  });
});
