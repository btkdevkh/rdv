"use client";

import { ReactNode } from "react";
import { User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";

type ActionButtonProps = {
  children: ReactNode;
  id: string;
  data?: User[];
  handler: (id: string) => void;
};

const ActionButton = ({ children, id, data, handler }: ActionButtonProps) => {
  const { data: session } = useSession();

  return (
    <button
      type="submit"
      title="Supprimer"
      className="cursor-pointer"
      onClick={() => {
        if (data?.length === 1) {
          alert("Vous êtes sur le point de supprimer le dernier utilisateur");
          if (confirm("Souhaitez-vous continuer ?")) {
            handler(id);
            return signOut();
          }
          return;
        }

        if (
          session?.user.role === "Admin" &&
          data?.find((u) => u.id === id)?.role === "Admin"
        ) {
          alert("Vous êtes sur le point de vous supprimer vous même");
          if (confirm("Souhaitez-vous continuer ?")) {
            handler(id);
            return signOut();
          }
          return;
        }

        if (data?.find((u) => u.id === id)?.role === "Admin") {
          alert("Vous êtes sur le point de supprimer un utilisateur Admin");
          if (confirm("Souhaitez-vous continuer ?")) {
            handler(id);
          }
          return;
        }

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
