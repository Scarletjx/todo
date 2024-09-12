import { useState, useEffect } from "react";
import { Box, Button, Heading, Flex, Text, Collapse } from "@chakra-ui/react";
import { DragDropContext } from "react-beautiful-dnd";
import { AddIcon, CheckIcon } from "@chakra-ui/icons";
import EditModal from "./components/EditModal";
import TaskList from "./components/TaskList";
import ToggleButton from "./components/ToggleButton";
import SearchBar from "./SearchBar";
import axios from "axios";
import AlertMessage from "./components/AlertMessage";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  description?: string;
  createdAt: string;
}

const API_URL = "http://localhost:5000/api/todos";

function App() {
  const [incompleteTodos, setIncompleteToDos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedToDos] = useState<Todo[]>([]);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalDescription, setModalDescription] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [showCompleted, setShowCompleted] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        const todos = response.data;
        const incomplete = todos.filter((todo: Todo) => !todo.completed);
        const completed = todos.filter((todo: Todo) => todo.completed);
        setIncompleteToDos(incomplete);
        setCompletedToDos(completed);
      })
      .catch((error) => {
        setError("Error fetching todos: " + error);
      });
  }, []);

  const openCreateModal = () => {
    setModalTitle("");
    setModalDescription("");
    setModalMode("create");
    setModalOpen(true);
  };

  const openEditModal = (id: number, title: string, description: string) => {
    setEditId(id);
    setModalTitle(title);
    setModalDescription(description);
    setModalMode("edit");
    setModalOpen(true);
  };

  const calculateNextId = () => {
    const allTodos = [...incompleteTodos, ...completedTodos];
    const highestId =
      allTodos.length > 0 ? Math.max(...allTodos.map((todo) => todo.id)) : 0;

    return highestId + 1;
  };

  const saveTodo = (title: string, description: string) => {
    if (modalMode === "create") {
      // Creating new task
      const newTodo: Todo = {
        id: calculateNextId(),
        title,
        completed: false,
        description: description,
        createdAt: new Date().toISOString(),
      };
      axios
        .post(API_URL, newTodo)
        .then((response) => {
          setIncompleteToDos([...incompleteTodos, response.data]);
        })
        .catch((error) => setError("Error creating todo:" + error));
    } else if (modalMode === "edit" && editId !== null) {
      axios
        .put(API_URL + `/${editId}`, {
          title,
          description,
        })
        .then((response) => {
          setIncompleteToDos(
            incompleteTodos.map((todo) =>
              todo.id === editId ? { ...todo, title, description } : todo
            )
          );
        })
        .catch((error) => setError("Error updating todo:" + error));
    }
    setModalOpen(false);
  };

  const deleteTodo = (id: number) => {
    axios
      .delete(API_URL + `/${id}`)
      .then(() => {
        setIncompleteToDos(incompleteTodos.filter((todo) => todo.id !== id));
        setCompletedToDos(completedTodos.filter((todo) => todo.id !== id));
      })
      .catch((error) => setError("Error deleting todo:" + error));
  };

  const completeTodo = (id: number) => {
    const todo = incompleteTodos.find((todo) => todo.id === id);
    if (todo) {
      axios
        .put(API_URL + `/${id}`, {
          ...todo,
          completed: true,
        })
        .then(() => {
          setIncompleteToDos(incompleteTodos.filter((t) => t.id !== id));
          setCompletedToDos([...completedTodos, { ...todo, completed: true }]);
        })
        .catch((error) => setError("Error completing todo:" + error));
    } else {
      const completedTodo = completedTodos.find(
        (todo: { id: number }) => todo.id === id
      );
      if (completedTodo) {
        axios
          .put(API_URL + `/${id}`, {
            ...completedTodo,
            completed: false,
          })
          .then(() => {
            setCompletedToDos(
              completedTodos.filter((t: { id: number }) => t.id !== id)
            );
            setIncompleteToDos([
              ...incompleteTodos,
              { ...completedTodo, completed: false },
            ]);
          })
          .catch((error) => setError("Error marking todo incomplete:" + error));
      }
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredIncompleteToDos = incompleteTodos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompletedToDos = completedTodos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Box px={20} py={10}>
      <Flex alignItems="center" mb={4}>
        <Box
          bg="blue"
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

        <SearchBar
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
        />
      </Flex>
      <Heading mt={10} size="lg">
        Welcome,
        <Heading as="span" color="blue" size="lg">
          {" "}
          Guest
        </Heading>
        <Heading as="span" size="lg">
          .
        </Heading>
      </Heading>
      <Text mt={2} color="grey.300">
        You've got {incompleteTodos.length} tasks to do.
      </Text>

      {error && (
        <Box py={5}>
          <AlertMessage
            message={error}
            onClose={() => {
              setError(null);
            }}
          />
        </Box>
      )}

      <Button onClick={openCreateModal} bg="white" my={6} p="18px">
        <Flex gap={4}>
          <AddIcon
            fontSize="23px"
            color="grey.200"
            border="2px"
            borderColor="grey.200"
            borderRadius="md"
            p={1}
          />
          <Text color="grey.300" alignContent="center">
            Add a new task...
          </Text>
        </Flex>
      </Button>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Todo List */}
        <TaskList
          todos={filteredIncompleteToDos}
          completeTodo={completeTodo}
          deleteTodo={deleteTodo}
          editTodo={openEditModal}
          droppableId="incomplete"
        />

        {/* Completed Tasks - Expandable */}
        <Flex my={4} gap={2} alignItems="center">
          <Heading color="grey.300" size="ms">
            Completed ({completedTodos.length})
          </Heading>
          <ToggleButton
            bg="white"
            isRound={false}
            isToggled={showCompleted}
            onToggle={() => setShowCompleted(!showCompleted)}
            ariaLabel="Toggle Completed Tasks"
          />
          <Button
            ml="auto"
            bg="white"
            color="red"
            as="u"
            onClick={() => setCompletedToDos([])}
            _hover={{
              bg: "rgba(255, 94, 94, 0.15)",
            }}
          >
            Delete all
          </Button>
        </Flex>

        <Collapse in={showCompleted}>
          <TaskList
            todos={filteredCompletedToDos}
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
          initialTitle={modalTitle}
          initialDescription={modalDescription}
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
