"use client";

import { ReactNode } from "react";

type ActionButtonProps = {
  children: ReactNode;
  id: string;
  handler: (id: string) => void;
};

const ActionButton = ({ children, id, handler }: ActionButtonProps) => {
  return (
    <button
      type="submit"
      title="Supprimer"
      className="cursor-pointer"
      onClick={() => {
        if (confirm("Souhaitez-vous continuer ?")) {
          handler(id);
        }
      }}
    >
      {children}
    </button>
  );
};

export default ActionButton;
