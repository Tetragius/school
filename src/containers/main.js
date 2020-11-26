import React from "react";
import { useHistory } from "react-router-dom";
import { Sidebar } from "vienna-ui";
import { useAuth } from "../services/Auth";

export default function Main() {
  const history = useHistory();
  const { userId } = useAuth();

  return (
    <Sidebar header={null}>
      {!userId && (
        <>
          <Sidebar.Item
            active={history.location.pathname.startsWith("/list")}
            onClick={() => history.push("/list")}
          >
            Задания
          </Sidebar.Item>
          <Sidebar.Item
            active={history.location.pathname === "/students"}
            onClick={() => history.push("/students")}
          >
            Ученики
          </Sidebar.Item>
        </>
      )}
      {userId && (
        <>
          <Sidebar.Item
            active={history.location.pathname.startsWith("/student")}
            onClick={() => history.push(`/student/${userId}`)}
          >
            Задания
          </Sidebar.Item>
        </>
      )}
    </Sidebar>
  );
}
