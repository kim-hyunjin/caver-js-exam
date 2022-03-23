import Caver, { KIP7 } from "caver-js";
import caver from "./caver";
import TTHinstance from "./TTHinstance";

class KIP7Wrapper {
  private _caver: Caver;
  private _kip7: KIP7;
  constructor(caver: Caver, tokenInstance: KIP7) {
    this._caver = caver;
    this._kip7 = tokenInstance;
  }

  transfer({
    from,
    to,
    numOfToken,
  }: {
    from: string;
    to: string;
    numOfToken: number;
  }) {
    return this._kip7.transfer(
      to,
      this._caver.utils.toPeb(numOfToken, "KLAY"),
      {
        from,
      }
    );
  }

  async balanceOf(address: string, option?: { precision?: number }) {
    const balance = await this._kip7.balanceOf(address);
    return this.convertFromPeb(balance.toFixed(0), option?.precision);
  }

  async totalSupply(option?: { precision?: number }) {
    const total = await this._kip7.totalSupply();
    return this.convertFromPeb(total.toFixed(0), option?.precision);
  }

  private convertFromPeb(peb: string, precision: number = 0) {
    const converted = this._caver.utils.fromPeb(peb, "KLAY");
    if (converted.indexOf(".") === -1) return converted;
    return converted.substring(0, converted.indexOf(".") + precision + 1);
  }
}

const kip7Wrapper = new KIP7Wrapper(caver, TTHinstance);

export default kip7Wrapper;
