import {
  ChangeEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import useUserAddress from "../hooks/useUserAddress";
import caver from "../klaytn/caver";
import kip7Wrapper from "../klaytn/KIP7Wrapper";
import TTHinstance from "../klaytn/TTHinstance";

const tth = TTHinstance;
export default function TTHContainer() {
  const [totalToken, setTotalToken] = useState("0");
  const [ownToken, setOwnToken] = useState("0");
  const [toAddress, setToAddress] = useState("");
  const [sendToken, setSendToken] = useState(0);
  const userAddress = useUserAddress();

  const getBalance = useCallback(() => {
    if (userAddress) {
      kip7Wrapper
        .balanceOf(userAddress, { precision: 5 })
        .then((balance) => setOwnToken(balance));
    }
  }, [userAddress]);

  useEffect(() => {
    tth.name().then(console.log);
    tth.symbol().then(console.log);

    kip7Wrapper.totalSupply({ precision: 5 }).then((total) => {
      setTotalToken(total);
    });

    getBalance();
    const intervalId = setInterval(getBalance, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [getBalance]);

  const handleToAddressInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setToAddress(e.target.value);
  };
  const handleTokenInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSendToken(Number(e.target.value));
  };
  const handleSendButton: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!caver.utils.isAddress(toAddress)) {
      alert("보내는 주소가 유효하지 않습니다.");
      return;
    }
    alert(`보낼 토큰 개수 : ${sendToken}`);
    kip7Wrapper
      .transfer({ from: userAddress, to: toAddress, numOfToken: sendToken })
      .then(console.log);
  };

  return (
    <div>
      <div>
        <h1>Total TTH Token: {totalToken}</h1>
        <h1>My TTH Token: {ownToken}</h1>
        <div>
          <div>
            <label>보내는 주소</label>
            <input onChange={handleToAddressInput} />
          </div>
          <div>
            <label>토큰 개수</label>
            <input type="number" onChange={handleTokenInput} />
          </div>
          <button onClick={handleSendButton}>전송</button>
        </div>
      </div>
    </div>
  );
}
