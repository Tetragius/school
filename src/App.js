import React, { useEffect, useState } from "react";
import { HashRouter, Route } from "react-router-dom";
import { Body, Grid, Groups } from "vienna-ui";
import TasksList from "./containers/taskslist";
import Students from "./containers/students";
import Student from "./containers/student";
import Main from "./containers/main";
import Task from "./containers/task";
import { DB } from "./services/DB";

import "./styles.css";
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
              <div style={{ display: "flex", height: "100%" }}>
                <div>
                  <Route path="/" component={Main} />
                </div>
                <div style={{ flexGrow: "1" }}>
                  <Grid.Row align="center" style={{ height: "100%" }}>
                    <Grid.Col size={12}>
                      <Route path="/list/:edit?/:id?" component={TasksList} />
                      <Route path="/task/:id" component={Task} />
                      <Route path="/students" component={Students} />
                      <Route path="/student/:id" component={Student} />
                    </Grid.Col>
                  </Grid.Row>
                </div>
              </div>
            </HashRouter>
          </AuthProvider>
        )}
      </Body>
    </div>
  );
}
