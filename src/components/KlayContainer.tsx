import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import useUserAddress from "../hooks/useUserAddress";
import caver from "../klaytn/caver";
import klayWrapper from "../klaytn/KlayWrapper";

export default function KlayContainer() {
  const [toAddress, setToAddress] = useState("");
  const [sendKlay, setSendKaly] = useState(0);
  const userAddress = useUserAddress();

  const handleAddressChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setToAddress(e.target.value);
  };

  const handleKlayChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSendKaly(Number(e.target.value));
  };

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!caver.utils.isAddress(toAddress)) {
      alert("올바른 주소가 아닙니다.");
      return;
    }
    klayWrapper
      .transfer({
        from: userAddress,
        to: toAddress,
        klay: sendKlay,
      })
      .once("transactionHash", (transactionHash) => {
        console.log("txHash", transactionHash);
      })
      .once("receipt", (receipt) => {
        console.log("receipt", receipt);
      })
      .once("error", (error) => {
        console.log("error", error);
      });
  };

  return (
    <div>
      <h1>Send Transaction</h1>
      <div>
        <label>보내는 주소</label>
        <input onChange={handleAddressChange} />
      </div>
      <div>
        <label>보낼 금액</label>
        <input type="number" onChange={handleKlayChange} />
      </div>
      <button onClick={handleButtonClick}>전송</button>
    </div>
  );
}
