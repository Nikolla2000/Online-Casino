import { twoColsWin } from "../redux/features/slots/betsSlice";

const checkSlotWin = (slots, callback) => {

  for (let i = 0; i < slots.length; i++) {
    if (
      slots[i][0] === slots[i][1] &&
      slots[i][1] === slots[i][2] &&
      slots[i][2] === slots[i][3] &&
      slots[i][3] === slots[i][4]
    ) {
      alert("5 cols");
    } 
    else if (
      slots[i][0] === slots[i][1] &&
      slots[i][1] === slots[i][2] &&
      slots[i][2] === slots[i][3]
    ) {
      alert("4 cols");
    } 
    else if (slots[i][0] === slots[i][1] && slots[i][1] === slots[i][2]) {
      alert("3 cols");
    } 
    else if (slots[i][0] === slots[i][1]) {
      alert("2 cols");
      twoColsWin()
    }
  }
};

export default checkSlotWin;
