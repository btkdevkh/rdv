import { PacmanLoader } from "react-spinners";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex justify-center mt-3">
      <PacmanLoader color="#37d7b7" />
    </div>
  );
}
