import { useState } from "react";
import { Box, Button, Heading, Flex, Text, Collapse } from "@chakra-ui/react";
import { DragDropContext } from "react-beautiful-dnd";
import { AddIcon, CheckIcon } from "@chakra-ui/icons";
import EditModal from "./components/EditModal";
import TaskList from "./components/TaskList";
import ToggleButton from "./components/ToggleButton";
import SearchBar from "./components/SearchBar";
import AlertMessage from "./components/AlertMessage";
import { useTodos } from "./hooks/useTodos";
import { useModal } from "./hooks/useModal";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  description?: string;
  createdAt: string;
}

function App() {
  const {
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
  } = useTodos();

  const { modalState, openCreateModal, openEditModal, closeModal } = useModal();

  const [showCompleted, setShowCompleted] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const calculateNextId = () => {
    const allTodos = [...incompleteTodos, ...completedTodos];
    const highestId =
      allTodos.length > 0 ? Math.max(...allTodos.map((todo) => todo.id)) : 0;

    return highestId + 1;
  };

  const saveTodo = async (title: string, description: string) => {
    const { mode, editId } = modalState;

    if (mode === "create") {
      const newTodo: Todo = {
        id: calculateNextId(),
        title,
        completed: false,
        description: description,
        createdAt: new Date().toISOString(),
      };
      createTodo(newTodo);
    } else if (mode === "edit" && editId !== null) {
      updateTodo(editId, { title, description });
    }
    closeModal();
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
          <AlertMessage message={error} onClose={clearError} />
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
            onClick={deleteAllCompletedTodos}
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

      {modalState.isOpen && (
        <EditModal
          isOpen={modalState.isOpen}
          mode={modalState.mode}
          initialTitle={modalState.title}
          initialDescription={modalState.description}
          onSave={saveTodo}
          onClose={closeModal}
        />
      )}
    </Box>
  );
}

export default App;
