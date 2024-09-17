import { Draggable, Droppable } from "react-beautiful-dnd";
import { Todo } from "../App";
import { Flex } from "@chakra-ui/react";
import TodoItem from "./TodoItem";

const TaskList = ({
  todos,
  completeTodo,
  deleteTodo,
  editTodo,
  droppableId,
  isCompleted,
}: {
  todos: Todo[];
  completeTodo: (id: number, completed: boolean) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, title: string, description: string) => void;
  droppableId: string;
  isCompleted?: boolean;
}) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <Flex
          direction="column"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {todos.map((todo, index) => (
            <Draggable
              key={todo.id}
              draggableId={todo.id.toString()}
              index={index}
            >
              {(provided) => (
                <TodoItem
                  todo={todo}
                  provided={provided}
                  completeTodo={completeTodo}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                  isCompleted={isCompleted}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Flex>
      )}
    </Droppable>
  );
};

export default TaskList;
