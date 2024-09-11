import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  List,
  ListItem,
  Checkbox,
  Flex,
  IconButton,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { CheckIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import AlertMessage from "./components/AlertMessage";

const API_URL = "/todos.json";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

function App() {
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    const storedList = localStorage.getItem("todos");
    if (storedList) {
      setTodos(JSON.parse(storedList));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const addTodo = () => {
    if (newTodo) {
      const newTodoItem: Todo = {
        id: todos.length + 1,
        title: newTodo,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTodos([...todos, newTodoItem]);

      setNewTodo("");
    } else {
      setError("Todo title cannot be empty");
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: number, title: string) => {
    setEditId(id);
    setEditText(title);
  };

  const saveEdit = () => {
    if (editText === "") {
      setModalError("Todo title cannot be empty");
    } else if (editId !== null) {
      setTodos(
        todos.map((todo) =>
          todo.id === editId ? { ...todo, title: editText } : todo
        )
      );
      onCloseEdit();
    }
  };

  const completeTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const getTodosLength = () => {
    return todos.filter((todo) => !todo.completed).length;
  };

  const onCloseEdit = () => {
    setEditId(null);
    setEditText("");
    setModalError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewTodo(e.target.value);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditText(e.target.value);

  const sortedTodos = [...todos].sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  );

  return (
    <Box p={20}>
      <Box paddingBottom={5}>
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
          <Heading as="span" color="#007FFF" size="lg"> {" "}
            You Lazy Bean
          </Heading>
          <Heading as="span" size="lg">
            .
          </Heading>
        </Heading>
        <Text mt={2} color="#8D9CB8">
          You've got {getTodosLength()} tasks to do.
        </Text>
      </Box>

      <Flex direction="column" gap={4} align="center">
        {error && (
          <AlertMessage
            message={error}
            onClose={() => {
              setError(null);
            }}
          />
        )}
        <Flex width="100%" gap={2}>
          <Input
            value={newTodo}
            onChange={handleInputChange}
            placeholder="Add a new todo"
            size="md"
          />
          <Button onClick={addTodo} colorScheme="blue">
            Add Todo
          </Button>
        </Flex>

        <List spacing={3} w="100%">
          {sortedTodos.map((todo) => (
            <ListItem
              key={todo.id}
              p={3}
              borderRadius="xl"
              bg="#F5F7F9"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Checkbox
                size="lg"
                textDecoration={todo.completed ? "line-through" : undefined}
                textColor={todo.completed ? "grey" : "black"}
                onChange={() => completeTodo(todo.id)}
                isChecked={todo.completed}
                spacing='1rem'
                p={2}
                fontWeight='600'
                sx={{
                  // Change the color of the checkmark (tick) and checked background
                  "& .chakra-checkbox__control[data-checked]": {
                    bg: "#007FFF",        
                    borderColor: "#007FFF", 
                    color: "white",      
                  },
                }}
              >
                {todo.title}
              </Checkbox>
              <Flex gap={2} p={1} align="center">
                <IconButton
                  p={2}
                  as={MdEdit}
                  onClick={() => editTodo(todo.id, todo.title)}
                  aria-label="Edit"
                  color="#007FFF"
                  bg="#F5F7F9"
                  isRound={true}
                  _hover={{
                    bg: "rgba(0, 127, 255, 0.15)"
                  }}
                />
                <IconButton
                  fontSize='25px'
                  icon={<SmallCloseIcon />}
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete"
                  color="#FF5E5E"
                  bg="#F5F7F9"
                  isRound={true}
                  _hover={{
                    bg: "rgba(255, 94, 94, 0.15)"
                  }}
                />
              </Flex>
            </ListItem>
          ))}
        </List>
      </Flex>

      <Modal
        closeOnOverlayClick={false}
        isOpen={editId !== null}
        onClose={onCloseEdit}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify task title</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {modalError && (
              <AlertMessage
                message={modalError}
                onClose={() => {
                  setModalError(null);
                }}
              />
            )}
            <Input
              mt={2}
              value={editText}
              onChange={handleEditChange}
              placeholder="Edit todo title"
              size="md"
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={saveEdit} mr={3}>
              Save
            </Button>
            <Button onClick={onCloseEdit}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;
