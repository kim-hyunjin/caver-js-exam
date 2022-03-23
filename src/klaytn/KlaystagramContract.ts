import caver from "./caver";
import ABI from "./abi.json";
import { AbiItem, Contract } from "caver-js";

const contract = new caver.klay.Contract(
  ABI as AbiItem[],
  "0x3E8e97Acd8701C8D5808Ac69223183ecB8015e31"
);

export type Feed = {
  id?: string;
  ownerHistory?: string[];
  data?: string;
  name?: string;
  location?: string;
  caption?: string;
  timestamp?: string;
};

class Klaystagram {
  private _contract: Contract;
  private _feedKeyMap: { [key: string]: keyof Feed } = {
    0: "id",
    1: "ownerHistory",
    2: "data",
    3: "name",
    4: "location",
    5: "caption",
    6: "timestamp",
  };
  private _feeds: Feed[] = [];

  constructor(contract: Contract) {
    this._contract = contract;
  }

  async getFeeds() {
    this._feeds = await this.callFeeds();
    return this._feeds;
  }

  async callFeeds() {
    const totalPhotoCount: number = await this._contract.call(
      "getTotalPhotoCount"
    );

    const feedPromise: { [key: string]: string }[] = [];
    for (let i = 1; i <= totalPhotoCount; i++) {
      const photo = this._contract.methods.getPhoto(i).call();
      feedPromise.push(photo);
    }

    const resolved = await Promise.all(feedPromise);

    const keyRenamed: Feed[] = resolved.map((feed) =>
      this.renameKeyOfFeed(feed)
    );

    return keyRenamed.map((feed) => {
      return {
        ...feed,
        data: feed.data ? this.getUrlFromBytes(feed.data) : "",
      };
    });
  }

  async uploadPhoto(photoFile: File) {
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(photoFile);
    reader.onloadend = async () => {
      const buffer = Buffer.from(reader.result! as ArrayBuffer);
      // console.log("buffer", buffer);
      const hexString = "0x" + buffer.toString("hex");
      // console.log("hexString", hexString);
      const receipt = await this._contract.methods
        .uploadPhoto(hexString, photoFile.name, "location", "caption")
        .send({
          from: window.klaytn.selectedAddress,
          gas: "50000000",
        });
      // console.log(receipt);
      if (!receipt.txError) {
        alert("업로드 완료!");
        window.location.reload();
      }
    };
  }

  private renameKeyOfFeed = (feed: { [key: string]: string }): Feed =>
    Object.keys(feed).reduce(
      (acc, key) => ({
        ...acc,
        ...{ [this._feedKeyMap[key] || key]: feed[key] },
      }),
      {}
    );

  private getUrlFromBytes = (bytes: string) => {
    const hexString = bytes.slice(2);
    const arrayBufferView = new Uint8Array(
      hexString.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
    );
    const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
  };
}

export default new Klaystagram(contract);
