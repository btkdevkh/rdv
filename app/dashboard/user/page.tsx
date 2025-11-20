import { getConnectedUser } from "@/actions/auth/user";
import { deleteUser } from "@/actions/delete/user";
import { getUsers } from "@/actions/get/user";
import CreateButton from "@/components/CreateButton";
import ActionButton from "@/components/ActionButton";
import { redirect } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import { PiPencilDuotone } from "react-icons/pi";
import Link from "next/link";

const UserPage = async () => {
  const { user } = await getConnectedUser();

  if (user?.role === "User") {
    return redirect("/dashboard/rdv");
  }

  const data = await getUsers();

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        {data.users && data.users.length === 0 ? (
          <span className="bg-green-100 text-green-700 py-2 px-4 rounded">
            Il n'y pas d'utilisateur
          </span>
        ) : (
          <span className="text-graphite font-semibold uppercase border-b-2 border-stormy-teal">
            Utilisateurs
          </span>
        )}

        {/* Create button */}
        <CreateButton page="user" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-graphite">
        {data.users &&
          data.users.length > 0 &&
          data.users?.map((user) => (
            <div key={user.id} className="bg-white shadow p-3 relative">
              <div>
                <p>Prénom: {user.firstname}</p>
                <p>
                  NOM: <b>{user.lastname}</b>
                </p>
                <p>Email: {user.email}</p>
                <p> Rôle: {user.role}</p>
              </div>
              <div className="absolute top-2 right-13">
                {user.role === "Admin" && (
                  <MdAdminPanelSettings size={20} color="green" title="Admin" />
                )}
              </div>

              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <ActionButton
                  id={user.id}
                  data={data.users}
                  handler={deleteUser}
                >
                  <div className="bg-[rgb(0,0,0,0.1)] hover:bg-[rgb(0,0,0,0.3)] rounded-full p-2 transition">
                    <RiDeleteBin6Line size={20} color="crimson" />
                  </div>
                </ActionButton>

                <div className="bg-[rgb(0,0,0,0.1)] hover:bg-[rgb(0,0,0,0.3)] rounded-full p-2 transition">
                  <Link href={`/dashboard/user/update/${user.id}`}>
                    <PiPencilDuotone size={20} color="orange" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserPage;
