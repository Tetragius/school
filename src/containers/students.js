import React, { useCallback, useEffect, useState } from "react";
import { Card, Modal, Grid, Groups, Drawer, Button, Badge } from "vienna-ui";
import {
  getTasksForStudent,
  getStudents,
  addStudent,
  removeStudent,
  appendTaskToStudent,
  updateTaskForStudent,
} from "../services/EP";
import { AddStudentForm } from "../forms/addStudent";
import { Student } from "../components/student";
import { AddtaskToStudentForm } from "../forms/addTaskToStudent";
import { Task } from "./task";

const parseDate = (str) => {
  return str.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)/i, "$3.$2.$1");
};

export default function Students() {
  const [studentId, setStudentId] = useState();
  const [list, setList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [check, showCheck] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

  useEffect(() => {
    getStudents().then(setList);
  }, []);

  const handleSave = useCallback(async (data) => {
    await addStudent(data);
    setShowSaveDialog(false);
    getStudents().then(setList);
  }, []);

  const getTasks = useCallback((id) => {
    setStudentId(id);
    getTasksForStudent(id).then(setTasks);
  }, []);

  const showTasks = useCallback(
    (id) => {
      setShowDrawer(true);
      getTasks(id);
    },
    [getTasks]
  );

  const removeHandler = useCallback((id) => {
    removeStudent(id).then(() => getStudents().then(setList));
  }, []);

  const handleAddTask = useCallback(
    async (taskId) => {
      await appendTaskToStudent(studentId, taskId);
      setShowAddTaskDialog(false);
      getTasksForStudent(studentId).then(setTasks);
    },
    [studentId]
  );

  const openCheck = useCallback((task) => {
    showCheck(true);
    setTask(task);
  }, []);

  const updateTask = useCallback(
    async (_, comment, mark) => {
      await updateTaskForStudent(
        studentId,
        task.id,
        task.result,
        comment,
        mark
      );
      showCheck(false);
    },
    [studentId, task]
  );

  return (
    <Grid.Row align="center">
      <Grid.Col size={10}>
        <Groups design="vertical" style={{ padding: "16px" }}>
          <Card>
            <Card.Title>
              <Groups justifyContent="flex-end">
                <Button design="accent" onClick={() => setShowSaveDialog(true)}>
                  Добавить
                </Button>
              </Groups>
            </Card.Title>
          </Card>
          {list.map((item, idx) => (
            <Student
              key={item.id}
              item={item}
              onShowTask={showTasks}
              onRemove={removeHandler}
            />
          ))}
        </Groups>
      </Grid.Col>
      <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)}>
        <Drawer.Layout>
          <Drawer.Head>
            <Drawer.Title>Задания ученика</Drawer.Title>
          </Drawer.Head>
          <Drawer.Body scroll={true}>
            <Groups design="vertical">
              {tasks.map((task, idx) => (
                <Card
                  key={idx}
                  title={task?.name}
                  footer={
                    task.isFinished && (
                      <Button onClick={() => openCheck(task)}>
                        Просмотреть
                      </Button>
                    )
                  }
                >
                  <Card.Subtitle>
                    <Groups>
                      <Badge>
                        {task.isFinished
                          ? `выполнено: ${parseDate(task.finishedOn)}`
                          : "не выполнено"}
                      </Badge>
                      {task.mark && <Badge>{task.mark}</Badge>}
                    </Groups>
                  </Card.Subtitle>
                </Card>
              ))}
            </Groups>
          </Drawer.Body>
          <Drawer.Footer>
            <Button design="accent" onClick={() => setShowAddTaskDialog(true)}>
              Добавить
            </Button>
          </Drawer.Footer>
        </Drawer.Layout>
      </Drawer>
      <Modal isOpen={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <Modal.Layout>
          <Modal.Head>
            <Modal.Title>Добавить ученика</Modal.Title>
          </Modal.Head>
          <Modal.Body>
            <AddStudentForm onOk={handleSave} />
          </Modal.Body>
        </Modal.Layout>
      </Modal>
      <Modal
        isOpen={showAddTaskDialog}
        onClose={() => setShowAddTaskDialog(false)}
      >
        <Modal.Layout>
          <Modal.Head>
            <Modal.Title>Добавить задание</Modal.Title>
          </Modal.Head>
          <Modal.Body>
            <AddtaskToStudentForm onOk={handleAddTask} />
          </Modal.Body>
        </Modal.Layout>
      </Modal>
      <Modal isOpen={check} onClose={() => showCheck(false)}>
        <Task isAdmin task={task} onSave={updateTask} />
      </Modal>
    </Grid.Row>
  );
}
