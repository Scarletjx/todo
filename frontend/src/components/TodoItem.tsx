import React from "react";
import {
  Box,
  Checkbox,
  Collapse,
  Flex,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { Todo } from "./../App";
import ToggleButton from "./ToggleButton";

interface TodoItemProps {
  todo: Todo;
  provided: any;
  completeTodo: (id: number, completed: boolean) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, title: string, description: string) => void;
  isCompleted?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  provided,
  completeTodo,
  deleteTodo,
  editTodo,
  isCompleted,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      p={5}
      mb={5}
      borderRadius="xl"
      bg="grey.100"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Checkbox
          size="lg"
          border="grey.200"
          onChange={() => completeTodo(todo.id, !todo.completed)}
          isChecked={todo.completed}
          spacing="1rem"
          p={2}
          fontWeight="600"
          sx={{
            "& .chakra-checkbox__control[data-checked]": {
              bg: "blue",
              borderColor: "blue",
              color: "white",
            },
          }}
        />

        <Box flex="1" ml={4}>
          <Text
            fontWeight="bold"
            fontSize="lg"
            textDecoration={todo.completed ? "line-through" : undefined}
            textColor={todo.completed ? "grey" : "black"}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            cursor="pointer"
            onClick={toggleDescription}
          >
            {todo.title}
          </Text>

          <Collapse in={isExpanded}>
            <Text
              fontSize="sm"
              color="grey.300"
              mt={2}
              wordBreak="break-word"
              overflowWrap="break-word"
            >
              {todo.description}
            </Text>
          </Collapse>
        </Box>

        <Flex gap={2} p={1} align="center">
          {todo.description && (
            <ToggleButton
              bg=""
              isRound={true}
              isToggled={isExpanded}
              onToggle={toggleDescription}
              ariaLabel="Toggle Description"
            />
          )}

          {!isCompleted && (
            <IconButton
              p={2}
              as={MdEdit}
              onClick={() =>
                editTodo(
                  todo.id,
                  todo.title,
                  todo.description ? todo.description : ""
                )
              }
              aria-label="Edit"
              color="blue"
              bg="grey.100"
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
            color="red"
            bg="grey.100"
            isRound={true}
            _hover={{
              bg: "rgba(255, 94, 94, 0.15)",
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default TodoItem;
