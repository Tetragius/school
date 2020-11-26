import React, { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import { Body } from "vienna-ui";
import Main from "./containers/main";
import { DB } from "./services/DB";

import { AuthProvider } from "./services/Auth";

export const db = new DB();
export default function App() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    db.init().then((r) => setInit(true));
  }, []);

  return (
    <div style={{ left: 0, top: 0, bottom: 0, right: 0, position: "absolute" }}>
      <Body>
        {init && (
          <AuthProvider>
            <HashRouter>
              <Main />
            </HashRouter>
          </AuthProvider>
        )}
      </Body>
    </div>
  );
}
