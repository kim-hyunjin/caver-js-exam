import caver from "./caver";
import ABI from "./abi.json";
import { AbiItem } from "caver-js";

const contract = caver.contract.create(
  ABI as AbiItem[],
  "0x3E8e97Acd8701C8D5808Ac69223183ecB8015e31"
);

export default contract;
