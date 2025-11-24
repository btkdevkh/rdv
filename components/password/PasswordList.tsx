"use client";

import Link from "next/link";
import { useState } from "react";
import { Password } from "@prisma/client";
import { FaEye } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { PiPencilDuotone } from "react-icons/pi";
import ActionButton from "../ActionButton";
import { deletePassword } from "@/actions/delete/password";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEyeSlash } from "react-icons/fa";

type PasswordListProps = {
  passwords: Password[];
};

const PasswordList = ({ passwords }: PasswordListProps) => {
  const [id, setId] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [seeUsername, setSeeUsername] = useState(false);

  const handleSeePassword = (id: string) => {
    const found = passwords.find((p) => p.id === id);

    if (id === found?.id) {
      setId(id);
      setSeePassword(!seePassword);
    }
  };

  const handleSeeUsername = (id: string) => {
    const found = passwords.find((p) => p.id === id);

    if (id === found?.id) {
      setId(id);
      setSeeUsername(!seeUsername);
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-graphite">
      {passwords &&
        passwords.length > 0 &&
        passwords.map((password) => (
          <div
            key={password.id}
            className="bg-white flex flex-col gap-5 shadow p-3 relative rounded overflow-hidden"
          >
            <div className="flex flex-col gap-3 justify-between">
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex flex-col gap-1">
                  <span>Username</span>
                  <div className="bg-[rgb(0,0,0,0.1)] py-1 px-3 flex items-center justify-between gap-5 rounded">
                    {seeUsername && id === password.id
                      ? password.username
                      : "************"}

                    <div className="flex items-center gap-3">
                      <button
                        title="Voir"
                        className="cursor-pointer"
                        onClick={() => handleSeeUsername(password.id)}
                      >
                        {seeUsername && id === password.id ? (
                          <FaEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>
                      <button
                        title="Copier"
                        className="cursor-pointer"
                        onClick={() => {
                          window.navigator.clipboard.writeText(
                            password.username.trim()
                          );
                        }}
                      >
                        <MdOutlineContentCopy size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span>Password</span>
                  <div className="bg-[rgb(0,0,0,0.1)] py-1 px-3 flex items-center justify-between gap-5 rounded">
                    <span>
                      {seePassword && id === password.id
                        ? password.password
                        : "************"}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        title="Voir"
                        type="button"
                        className="cursor-pointer"
                        onClick={() => handleSeePassword(password.id)}
                      >
                        {seePassword && id === password.id ? (
                          <FaEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>
                      <button
                        title="Copier"
                        className="cursor-pointer"
                        onClick={() => {
                          window.navigator.clipboard.writeText(
                            password.password.trim()
                          );
                        }}
                      >
                        <MdOutlineContentCopy size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <div className="flex flex-col gap-1">
                  <span>Sites</span>
                  <span className="py-1 underline rounded">
                    {password.sites.map((site) => (
                      <Link href={site} key={site} target="_blank">
                        {password.sites}
                      </Link>
                    ))}
                  </span>
                </div>

                {password.note && (
                  <div className="flex flex-col gap-1">
                    <span>Note</span>
                    <span className="bg-[rgb(0,0,0,0.1)] py-1 px-3 rounded">
                      {password.note}
                    </span>
                  </div>
                )}
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
                handler={deletePassword as (id?: string) => void}
              >
                <div className="bg-[rgb(0,0,0,0.1)] hover:bg-[rgb(0,0,0,0.3)] rounded-full p-2 transition">
                  <RiDeleteBin6Line size={20} color="crimson" />
                </div>
              </ActionButton>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PasswordList;
