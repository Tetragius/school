import React from "react";
import { useHistory } from "react-router-dom";
import { Sidebar } from "vienna-ui";
import { useAuth } from "../services/Auth";
import { People, Document } from "vienna.icons";

export default function Menu() {
  const history = useHistory();
  const { isAdmin, id: userId } = useAuth();

  return (
    <Sidebar header={null}>
      {isAdmin && (
        <>
          <Sidebar.Item
            icon={<Document />}
            active={history.location.pathname.startsWith("/list")}
            onClick={() => history.push("/list")}
          >
            Задания
          </Sidebar.Item>
          <Sidebar.Item
            icon={<People />}
            active={history.location.pathname === "/students"}
            onClick={() => history.push("/students")}
          >
            Ученики
          </Sidebar.Item>
        </>
      )}
      {!isAdmin && (
        <Sidebar.Item
          icon={<Document />}
          active={history.location.pathname.startsWith("/student")}
          onClick={() => history.push(`/student/${userId}`)}
        >
          Задания
        </Sidebar.Item>
      )}
    </Sidebar>
  );
}
