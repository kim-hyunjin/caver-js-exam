import React, { useEffect, useState } from "react";
import caver from "../klaytn/caver";
import contract, { Feed } from "../klaytn/KlaystagramContract";
import UploadPhoto from "./UploadPhoto";

export default function KlaystagramContainer() {
  const [feed, setFeed] = useState<Feed[]>([]);

  useEffect(() => {
    caver.rpc.klay.getClientVersion().then(console.log);
    contract.getFeeds().then((feeds: Feed[]) => setFeed(feeds));
  }, []);

  return (
    <div>
      <div>
        {feed.map((feed, i) => (
          <img key={i} src={feed.data} alt="" />
        ))}
      </div>
      <UploadPhoto />
    </div>
  );
}
