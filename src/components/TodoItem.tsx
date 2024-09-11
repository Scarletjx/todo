import React from "react";
import { Checkbox, Flex, IconButton } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { Todo } from "./../App";

interface TodoItemProps {
  todo: Todo;
  provided: any;
  completeTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, title: string) => void;
  isCompleted?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  provided,
  completeTodo,
  deleteTodo,
  editTodo,
  isCompleted
}) => (
  <Flex
    p={3}
    mb={5}
    borderRadius="xl"
    bg="#F5F7F9"
    justifyContent="space-between"
    alignItems="center"
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
  >
    <Checkbox
      size="lg"
      border="#C6CFDC"
      textDecoration={todo.completed ? "line-through" : undefined}
      textColor={todo.completed ? "grey" : "black"}
      onChange={() => completeTodo(todo.id)}
      isChecked={todo.completed}
      spacing="1rem"
      p={2}
      fontWeight="600"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
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
      {!isCompleted && (
        <IconButton
          p={2}
          as={MdEdit}
          onClick={() => editTodo(todo.id, todo.title)}
          aria-label="Edit"
          color="#007FFF"
          bg="#F5F7F9"
          isRound={true}
          _hover={{
            bg: "rgba(0, 127, 255, 0.15)",
          }}
        />
      )}
      <IconButton
        fontSize="25px"
        icon={<SmallCloseIcon />}
        onClick={() => deleteTodo(todo.id)}
        aria-label="Delete"
        color="#FF5E5E"
        bg="#F5F7F9"
        isRound={true}
        _hover={{
          bg: "rgba(255, 94, 94, 0.15)",
        }}
      />
    </Flex>
  </Flex>
);

export default TodoItem;
