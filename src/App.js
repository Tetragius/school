import React from "react";
import { HashRouter } from "react-router-dom";
import { Body } from "vienna-ui";
import Main from "./containers/main";

import { AuthProvider } from "./services/Auth";

export default function App() {
  return (
    <div style={{ left: 0, top: 0, bottom: 0, right: 0, position: "absolute" }}>
      <Body>
        <AuthProvider>
          <HashRouter>
            <Main />
          </HashRouter>
        </AuthProvider>
      </Body>
    </div>
  );
}
