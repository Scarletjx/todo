import { useState } from "react";

export const useModal = () => {
  const [modalState, setModalState] = useState({
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