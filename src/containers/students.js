import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { db } from "../App";
import { Modal } from "../components/modal";
import { AddStudentForm } from "../forms/addStudent";
import { AddtaskToStudentForm } from "../forms/addTaskToStudent";

const Box = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Left = styled.div`
  width: 50%;
  height: 100%;
  border-right: 1px solid gray;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const LeftCenter = styled.div`
  width: 100%;
  height: calc(100% - 48px);
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  border: 1px solid gray;
  box-sizing: border-box;
  padding: 8px;
  transition: all 0.2s;
  cursor: pointer;
  margin-bottom: 8px;
  &:hover {
    background: #c9c9c9;
  }
`;

const Right = styled.div`
  width: 50%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
`;

const RightCenter = styled.div`
  width: 100%;
  height: calc(100% - 48px);
`;

export default function Students() {
  const [studentId, setStudentId] = useState();
  const [list, setList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

  const history = useHistory();

  useEffect(() => {
    db.getStudents().then(setList);
  }, []);

  const handleSave = useCallback((name) => {
    db.addStudent(name);
    setShowSaveDialog(false);
    db.getStudents().then(setList);
  }, []);

  const handleAddTask = useCallback(
    (taskId) => {
      db.appendTaskToStudent(studentId, taskId);
      setShowAddTaskDialog(false);
      db.getTasksForStudent(studentId).then(setTasks);
    },
    [studentId]
  );

  const getTasks = useCallback((id) => {
    setStudentId(id);
    db.getTasksForStudent(id).then(setTasks);
  }, []);

  return (
    <Box>
      <Left>
        <span style={{ display: "flex", alignItems: "center" }}>
          <h1>Ученики |</h1>
          &nbsp;
          <input
            type="button"
            value="На главную"
            onClick={() => history.push("/")}
          />
          &nbsp;
          <input
            type="button"
            value="Добавить"
            onClick={() => setShowSaveDialog(true)}
          />
        </span>
        <LeftCenter>
          {list.map((item, idx) => (
            <Item key={idx} onClick={() => getTasks(item.id)}>
              {item.name}
            </Item>
          ))}
        </LeftCenter>
      </Left>
      <Right>
        <span style={{ display: "flex", alignItems: "center" }}>
          <h1>Задания |</h1>
          &nbsp;
          <input
            type="button"
            value="Добавить"
            onClick={() => setShowAddTaskDialog(true)}
          />
        </span>
        <RightCenter>
          {tasks.map((task, idx) => (
            <Item key={idx}>{task.name}</Item>
          ))}
        </RightCenter>
      </Right>
      {showSaveDialog && (
        <Modal onClose={() => setShowSaveDialog(false)}>
          <AddStudentForm onOk={handleSave} />
        </Modal>
      )}
      {showAddTaskDialog && (
        <Modal onClose={() => setShowAddTaskDialog(false)}>
          <AddtaskToStudentForm onOk={handleAddTask} />
        </Modal>
      )}
    </Box>
  );
}
