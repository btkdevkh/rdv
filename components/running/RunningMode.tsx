import { PiParkFill } from "react-icons/pi";
import { TbTreadmill } from "react-icons/tb";

type RunningModeProps = {
  mode: string;
};

const RunningMode = ({ mode }: RunningModeProps) => {
  return (
    <>
      {mode === "outside" && <PiParkFill size={20} color="white" />}
      {mode === "treadmill" && <TbTreadmill size={20} color="white" />}
    </>
  );
};

export default RunningMode;
