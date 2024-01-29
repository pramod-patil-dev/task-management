import { atom } from "recoil";

const projectCompleted = atom({
  key: "projectDoneState",
  default: false,
});

export default projectCompleted;
