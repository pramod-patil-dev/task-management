import { atom } from "recoil";

const clickedAdd = atom({
  key: "clickedAddToDoState",
  default: false,
});

export default clickedAdd;
