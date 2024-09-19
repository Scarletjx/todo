import { useState } from "react";

export interface ModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  editId: number | null;
  title: string;
  description: string;
}

export interface UseModalReturn {
  modalState: ModalState;
  openCreateModal: () => void;
  openEditModal: (id: number, title: string, description: string) => void;
  closeModal: () => void;
}

export const useModal = (): UseModalReturn => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: "create" as "create" | "edit",
    title: "",
    description: "",
    editId: null as number | null,
  });

  const openCreateModal = () => {
    setModalState({
      isOpen: true,
      mode: "create",
      title: "",
      description: "",
      editId: null,
    });
  };

  const openEditModal = (id: number, title: string, description: string) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      title,
      description,
      editId: id,
    });
  };

  const closeModal = () => {
    setModalState((prevState) => ({ ...prevState, isOpen: false }));
  };

  return {
    modalState,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};