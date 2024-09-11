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
} from "@chakra-ui/react";
import AlertMessage from "./AlertMessage";

interface EditModalProps {
  isOpen: boolean;
  mode: "create" | "edit"; // Mode can be either 'create' or 'edit'
  initialText: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  mode,
  initialText,
  onSave,
  onClose,
}) => {
  const [inputValue, setInputValue] = React.useState(initialText);
  const [error, setError] = React.useState<string | null>(null); 

  const handleSave = () => {
    if (inputValue.trim() === "") {
      setError("Task title cannot be empty.");
      return;
    }
    onSave(inputValue);
    setInputValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
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
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder={
              mode === "create" ? "Enter new task title" : "Edit task title"
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSave} colorScheme="blue">
            {mode === "create" ? "Create" : "Save"}
          </Button>
          <Button onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
