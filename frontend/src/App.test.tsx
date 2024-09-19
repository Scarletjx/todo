// App.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { useTodos, UseTodosReturn } from "./hooks/useTodos";
import { useModal, UseModalReturn } from "./hooks/useModal";

//Mock the entire module where useTodos and useModal are defined
jest.mock("./hooks/useTodos");
jest.mock("./hooks/useModal");

// TypeScript interface for mock implementation of useTodos
const mockUseTodos: UseTodosReturn = {
  incompleteTodos: [
    { id: 1, title: "Test Todo 1", completed: false, createdAt: "2023-05-01" },
    { id: 2, title: "Test Todo 2", completed: false, createdAt: "2023-05-02" },
  ],
  completedTodos: [],
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
  completeTodo: jest.fn(),
  deleteAllCompletedTodos: jest.fn(),
  error: null,
  clearError: jest.fn(),
  onDragEnd: jest.fn(),
};

// TypeScript interface for mock implementation of useModal
const mockUseModal: UseModalReturn = {
  modalState: {
    isOpen: false,
    mode: "create",
    editId: null,
    title: "",
    description: "",
  },
  openCreateModal: jest.fn(),
  openEditModal: jest.fn(),
  closeModal: jest.fn(),
};

beforeEach(() => {
  (useTodos as jest.Mock).mockReturnValue(mockUseTodos);
  (useModal as jest.Mock).mockReturnValue(mockUseModal);
});

describe("App Component", () => {
  test("renders the header and task count", () => {
    render(<App />);
    expect(screen.getByText("Taski")).toBeInTheDocument();
    expect(
      screen.getByText(/You've got \d+ tasks to do\./i)
    ).toBeInTheDocument();
  });

  test("displays and filters tasks based on search query", async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search tasks...");

    fireEvent.change(searchInput, { target: { value: "Test Todo 1" } });

    // Wait for "Test Todo 1" to appear in the DOM
    const todo1 = await screen.findByText("Test Todo 1");
    expect(todo1).toBeInTheDocument();

    // Assert that "Test Todo 2" is not in the document
    expect(screen.queryByText("Test Todo 2")).not.toBeInTheDocument();
  });

  test("opens modal when Add button is clicked", () => {
    render(<App />);
    const addButton = screen.getByText("Add a new task...");
    fireEvent.click(addButton);
    expect(mockUseModal.openCreateModal).toHaveBeenCalled();
  });

  test("deletes all completed tasks", () => {
    render(<App />);
    const deleteAllButton = screen.getByText("Delete all");
    fireEvent.click(deleteAllButton);
    expect(mockUseTodos.deleteAllCompletedTodos).toHaveBeenCalled();
  });

  test("renders error message when error exists", () => {
    (useTodos as jest.Mock).mockReturnValueOnce({
      ...mockUseTodos,
      error: "Error fetching todos",
    });
    render(<App />);
    expect(screen.getByText("Error fetching todos")).toBeInTheDocument();
  });

  test("calls createTodo when saving a new todo", async () => {
    (useModal as jest.Mock).mockReturnValueOnce({
      ...mockUseModal,
      modalState: {
        isOpen: true,
        mode: "create",
        editId: 1,
        title: "To do 3",
      },
    });

    render(<App />);

    // Simulate opening and saving a new todo in the modal
    const createButton = screen.getByText("Create");
    fireEvent.click(createButton);
    expect(mockUseTodos.createTodo).toHaveBeenCalled();
  });
});
