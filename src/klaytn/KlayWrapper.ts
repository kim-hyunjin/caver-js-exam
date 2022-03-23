import Caver from "caver-js";
import caver from "./caver";

class KlayWrapper {
  private _caver: Caver;
  constructor(caver: Caver) {
    this._caver = caver;
  }

  transfer({ from, to, klay }: { from: string; to: string; klay: number }) {
    return this._caver.klay.sendTransaction({
      type: "VALUE_TRANSFER",
      from: from,
      to: to,
      value: this._caver.utils.toPeb(String(klay), "KLAY"),
      gas: "21000",
    });
  }
}

const klayWrapper = new KlayWrapper(caver);

export default klayWrapper;
