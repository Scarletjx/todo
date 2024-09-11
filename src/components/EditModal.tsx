import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import AlertMessage from "./AlertMessage";

interface EditModalProps {
  isOpen: boolean;
  mode: "create" | "edit"; // Mode can be either 'create' or 'edit'
  initialTitle: string;
  initialDescription: string;
  onSave: (value: string, description: string) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  mode,
  initialTitle,
  initialDescription,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = React.useState(initialTitle);
  const [description, setDescription] = React.useState(initialDescription);
  const [error, setError] = React.useState<string | null>(null);

  const handleSave = () => {
    if (title.trim() === "") {
      setError("Task title cannot be empty.");
      return;
    }
    onSave(title, description);
    setTitle("");
    setDescription("");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value.trim() !== "") {
      setError(null);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    if (e.target.value.trim() !== "") {
      setError(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "create" ? "Create New Task" : "Edit Task"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && (
            <AlertMessage
              message={error}
              onClose={() => {
                setError(null);
              }}
            />
          )}
          <Text m={2}>Title</Text>
          <Input
            m={2}
            value={title}
            onChange={handleTitleChange}
            placeholder={
              mode === "create" ? "Enter new task title" : "Edit task title"
            }
          />
          <Text m={2}>Description</Text>
          <Input
            m={2}
            value={description}
            onChange={handleDescriptionChange}
            placeholder={
              mode === "create"
                ? "Enter new task description"
                : "Edit task description"
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button bg="#007FFF" textColor="white" onClick={handleSave}>
            {mode === "create" ? "Create" : "Save"}
          </Button>
          <Button color="#007FFF" onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
