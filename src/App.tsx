import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Flex,
  IconButton,
  Text,
  Collapse,
} from "@chakra-ui/react";
import { DragDropContext } from "react-beautiful-dnd";
import {
  AddIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import EditModal from "./components/EditModal";
import TaskList from "./components/TaskList";

const API_URL = "/todos.json";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

function App() {
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);
  const [incompleteTodos, setIncompleteToDos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedToDos] = useState<Todo[]>([]);
  const [modalText, setModalText] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const loadIncompleteTodos = localStorage.getItem("incompleteTodos");
    const loadCompleteTodos = localStorage.getItem("completeTodos");
    if (loadIncompleteTodos) {
      setIncompleteToDos(JSON.parse(loadIncompleteTodos));
    }
    if (loadCompleteTodos) {
      setCompletedToDos(JSON.parse(loadCompleteTodos));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("incompleteTodos", JSON.stringify(incompleteTodos));
      localStorage.setItem("completeTodos", JSON.stringify(completedTodos));
    }
  }, [incompleteTodos, completedTodos, isLoaded]);

  const openCreateModal = () => {
    setModalText(""); // Clear input for new task
    setModalMode("create");
    setModalOpen(true);
  };

  const openEditModal = (id: number, title: string) => {
    setEditId(id);
    setModalText(title);
    setModalMode("edit");
    setModalOpen(true);
  };

  const calculateNextId = () => {
    const allTodos = [...incompleteTodos, ...completedTodos];
    const highestId =
      allTodos.length > 0 ? Math.max(...allTodos.map((todo) => todo.id)) : 0;

    return highestId + 1;
  };

  const saveTodo = (title: string) => {
    if (modalMode === "create") {
      // Creating new task
      const newTodo: Todo = {
        id: calculateNextId(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setIncompleteToDos([...incompleteTodos, newTodo]);
    } else if (modalMode === "edit" && editId !== null) {
      setIncompleteToDos(
        incompleteTodos.map((todo) =>
          todo.id === editId ? { ...todo, title } : todo
        )
      );
    }
    setModalOpen(false);
  };

  const deleteTodo = (id: number) => {
    setIncompleteToDos(incompleteTodos.filter((todo) => todo.id !== id));
    setCompletedToDos(completedTodos.filter((todo) => todo.id !== id));
  };

  const completeTodo = (id: number) => {
    const todo = incompleteTodos.find((todo) => todo.id === id);
    if (todo) {
      setIncompleteToDos(incompleteTodos.filter((t) => t.id !== id));
      setCompletedToDos([...completedTodos, { ...todo, completed: true }]);
    } else {
      const completedTodo = completedTodos.find(
        (todo: { id: number }) => todo.id === id
      );
      if (completedTodo) {
        setCompletedToDos(
          completedTodos.filter((t: { id: number }) => t.id !== id)
        );
        setIncompleteToDos([
          ...incompleteTodos,
          { ...completedTodo, completed: false },
        ]);
      }
    }
  };

  const reorder = (list: Todo[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    // Moving within the same list
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
    }
  };

  return (
    <Box p={20}>
      <Flex alignItems="center" mb={4}>
        {/* Checkbox icon with white tick and blue background */}
        <Box
          bg="#007FFF"
          borderRadius="md"
          color="white"
          display="flex"
          justifyContent="center"
          alignItems="center"
          w={6}
          h={6}
          mr={2}
        >
          <CheckIcon boxSize={3} />
        </Box>
        <Heading size="md">Taski</Heading>
      </Flex>
      <Heading mt={10} size="lg">
        Welcome,
        <Heading as="span" color="#007FFF" size="lg">
          {" "}
          Guest
        </Heading>
        <Heading as="span" size="lg">
          .
        </Heading>
      </Heading>
      <Text mt={2} color="#8D9CB8">
        You've got {incompleteTodos.length} tasks to do.
      </Text>

      <Button onClick={openCreateModal} bg="white" my={6} pl="18px">
        <Flex gap={4}>
          <AddIcon
            fontSize="23px"
            color="#C6CFDC"
            border="2px"
            borderColor="#C6CFDC"
            borderRadius="md"
            p={1}
          />
          <Text color="#8D9CB8" alignContent="center">
            Add a new task...
          </Text>
        </Flex>
      </Button>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Todo List */}
        <TaskList
          todos={incompleteTodos}
          completeTodo={completeTodo}
          deleteTodo={deleteTodo}
          editTodo={openEditModal}
          droppableId="incomplete"
        />

        {/* Completed Tasks - Expandable */}
        <Flex my={4} gap={2} alignItems="center">
          <Heading color="#8D9CB8" size="ms">
            Completed ({completedTodos.length})
          </Heading>
          <IconButton
            color="#8D9CB8"
            bg="white"
            size="ml"
            fontSize="33px"
            icon={showCompleted ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={() => setShowCompleted(!showCompleted)}
            aria-label="Toggle Completed Tasks"
          />
        </Flex>

        <Collapse in={showCompleted}>
          <TaskList
            todos={completedTodos}
            completeTodo={completeTodo}
            deleteTodo={deleteTodo}
            editTodo={openEditModal}
            droppableId="completed"
            isCompleted={true}
          />
        </Collapse>
      </DragDropContext>

      {modalOpen && (
        <EditModal
          isOpen={modalOpen}
          mode={modalMode}
          initialText={modalText}
          onSave={saveTodo}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      )}
    </Box>
  );
}

export default App;
