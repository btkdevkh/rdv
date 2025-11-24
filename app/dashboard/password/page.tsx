import { deleteRdv } from "@/actions/delete/rdv";
import { getPasswords } from "@/actions/get/password";
import ActionButton from "@/components/ActionButton";
import CreateButton from "@/components/CreateButton";
import Link from "next/link";
import { PiPencilDuotone } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";

const PasswordPage = async () => {
  const data = await getPasswords();

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        {data.passwords && data.passwords.length === 0 ? (
          <span className="bg-green-100 text-green-700 py-2 px-4 rounded">
            Il n'y pas de mot de passe
          </span>
        ) : (
          <span className="text-graphite font-semibold uppercase border-b-2 border-stormy-teal">
            Mots de passe
          </span>
        )}

        {/* Create button */}
        <CreateButton page="password" />
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-3 text-graphite w-fit">
        {data.passwords &&
          data.passwords.length > 0 &&
          data.passwords.map((password) => (
            <div
              key={password.id}
              className="bg-white flex flex-col gap-5 shadow p-3 relative rounded"
            >
              <div className="flex gap-3 items-center justify-between">
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex flex-col gap-1">
                    <span>Username</span>
                    <div className="bg-[rgb(0,0,0,0.1)] py-1 px-3 flex items-center justify-between gap-5 rounded">
                      <span>{password.username}</span>
                      <button>
                        <MdOutlineContentCopy size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span>Password</span>
                    <div className="bg-[rgb(0,0,0,0.1)] py-1 px-3 flex items-center justify-between gap-5 rounded">
                      <span>************</span>
                      <div className="flex gap-3">
                        <button>
                          <FaEye size={20} />
                        </button>
                        <button>
                          <MdOutlineContentCopy size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex flex-col gap-1">
                    <span>Sites</span>
                    <span className="bg-[rgb(0,0,0,0.1)] py-1 px-3 rounded">
                      {password.sites.map((site) => (
                        <Link href={site} key={site} target="_blank">
                          {password.sites}
                        </Link>
                      ))}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span>Note</span>
                    <span className="bg-[rgb(0,0,0,0.1)] py-1 px-3 rounded">
                      {password.note}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="bg-[rgb(0,0,0,0.1)] hover:bg-[rgb(0,0,0,0.3)] rounded-full p-2 transition">
                  <Link href={`/dashboard/password/update/${password.id}`}>
                    <PiPencilDuotone size={20} color="orange" />
                  </Link>
                </div>

                <ActionButton
                  id={password.id}
                  handler={deleteRdv as (id?: string) => void}
                >
                  <div className="bg-[rgb(0,0,0,0.1)] hover:bg-[rgb(0,0,0,0.3)] rounded-full p-2 transition">
                    <RiDeleteBin6Line size={20} color="crimson" />
                  </div>
                </ActionButton>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PasswordPage;
