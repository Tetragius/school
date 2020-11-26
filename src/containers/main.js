import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Route } from "react-router-dom";
import { Grid, Header, Button, Groups } from "vienna-ui";
import { Animal } from "vienna.icons";
import Task from "./task";
import { useAuth, AuthProvider } from "../services/Auth";
import TasksList from "./taskslist";
import Students from "./students";
import Student from "./student";
import Menu from "./menu";
import Login from "./login";

export default function Main() {
  const history = useHistory();
  const { id: userId, isAdmin, name } = useAuth();

  useEffect(() => {
    console.log(userId);
    if (!userId) {
      history.replace("/login");
    }
  });

  const headActions = userId && (
    <Groups>
      {name}
      <Button design="outline" size="s" onClick={AuthProvider.logoff}>
        Выход
      </Button>
    </Groups>
  );

  return (
    <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <Header logo={<Animal size="xl" />} action={headActions} />
      <div
        style={{
          height: "calc(100% - 80px)",
          overflow: "hidden",
          display: "flex"
        }}
      >
        {userId && (
          <div>
            <Route path="/" component={Menu} />
          </div>
        )}
        <div style={{ flexGrow: "1", overflow: "auto" }}>
          <Grid.Row align="center" style={{ height: "100%" }}>
            <Grid.Col size={12}>
              {isAdmin && (
                <>
                  <Route path="/list/:edit?/:id?" component={TasksList} />
                  <Route path="/students" component={Students} />
                </>
              )}
              {userId && (
                <>
                  <Route path="/task/:id" component={Task} />
                  <Route path="/student" component={Student} />
                </>
              )}
              <Route path="/login" component={Login} />
            </Grid.Col>
          </Grid.Row>
        </div>
      </div>
    </div>
  );
}
