import React, { useEffect, useState } from "react";
import { HashRouter, Route } from "react-router-dom";
import Creator from "./containers/creator";
import TasksList from "./containers/taskslist";
import { DB } from "./services/DB";

import "./styles.css";

export const db = new DB();

export default function App() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    db.init().then((r) => setInit(true));
  }, []);

  return (
    <div className="App">
      {init && (
        <HashRouter>
          <div className="container">
            <Route path="/edit/:id?" component={Creator} />
            <Route path="/list" component={TasksList} />
          </div>
        </HashRouter>
      )}
    </div>
  );
}
