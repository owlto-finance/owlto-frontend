const list = [
  1, 42161, 10, 324, 42170, 59144, 8453, 1101, 137, 7777777, 5000, 169, 255,
  534352, 424, 204, 56, 666666666,
];

const dtcs = ["0.00065", "0.0008", "0.001", "0.0012"];
const etherum = ["0.0035", "0.004", "0.0045", "0.005"];
const zora = ["0.001", "0.001", "0.001", "0.0012"];
const kroma = ["0.0008", "0.0008", "0.001", "0.0012"];
const bnb = ["0.0004", "0.0008", "0.001", "0.0012"];

const minMaxList = [0.01, 0.5, 0.8, 1];

let interval = 0;
if (0.01 < Number(amount)) {
  interval = 0;
} else if (0.01 <= Number(amount) && Number(amount) < 0.5) {
  interval = 1;
} else if (0.5 <= Number(amount) && Number(amount) < 0.8) {
  interval = 2;
} else {
  interval = 3;
}

if (toChainid === 1) {
  return etherum[interval];
} else if (toChainid === 7777777) {
  return zora[interval];
} else if (toChainid === 255) {
  return kroma[interval];
} else if (toChainid === 56) {
  return bnb[interval];
} else {
  return dtcs[interval];
}
