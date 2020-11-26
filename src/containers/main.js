import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Route } from "react-router-dom";
import { Grid } from "vienna-ui";
import Task from "./task";
import { useAuth } from "../services/Auth";
import TasksList from "./taskslist";
import Students from "./students";
import Student from "./student";
import Menu from "./menu";
import Login from "./login";

export default function Main() {
  const history = useHistory();
  const { id: userId, isAdmin } = useAuth();

  useEffect(() => {
    console.log(userId);
    if (!userId) {
      history.replace("/login");
    }
  });

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {userId && (
        <div>
          <Route path="/" component={Menu} />
        </div>
      )}
      <div style={{ flexGrow: "1" }}>
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
                <Route path="/student/:id" component={Student} />
              </>
            )}
            <Route path="/login" component={Login} />
          </Grid.Col>
        </Grid.Row>
      </div>
    </div>
  );
}
