import { useEffect, useState } from "react";

export default function useUserAddress() {
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (typeof window.klaytn !== "undefined") {
      try {
        window.klaytn.enable().then((accounts: string[]) => {
          setAddress(accounts[0]);
        });
      } catch (e) {
        alert("kaikas wallet 연결실패");
      }

      window.klaytn.on("accountsChanged", (accounts: string[]) => {
        setAddress(accounts[0]);
      });
    }
  }, []);

  return address;
}
