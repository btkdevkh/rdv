import { getPasswords } from "@/actions/get/password";
import CreateButton from "@/components/CreateButton";
import PasswordList from "@/components/password/PasswordList";

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

      <PasswordList passwords={data.passwords ?? []} />
    </div>
  );
};

export default PasswordPage;
