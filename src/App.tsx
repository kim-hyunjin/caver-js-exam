import React from "react";
import KlayContainer from "./components/KlayContainer";
import KlaystagramContainer from "./components/KlaystagramContainer";
import TTHContainer from "./components/TTHContainer";

function App() {
  return (
    <div className="App">
      <KlaystagramContainer />
      <KlayContainer />
      <TTHContainer />
    </div>
  );
}

export default App;
