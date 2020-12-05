import React, { useCallback, useEffect, useState } from "react";
import { Card, Modal, Grid, Groups, Drawer, Button, Badge } from "vienna-ui";
import {
  getTasksForStudent,
  getStudents,
  addStudent,
  removeStudent,
  appendTaskToStudent,
} from "../services/EP";
import { AddStudentForm } from "../forms/addStudent";
import { Container } from "../components/container";
import { AddtaskToStudentForm } from "../forms/addTaskToStudent";

const parseDate = (str) => {
  return str.replace(
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(:.*)/i,
    "$3.$2.$1 $4:$5"
  );
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
            <Card
              key={idx}
              footer={
                <Groups justifyContent="flex-end">
                  <Button onClick={() => showTasks(item.id)}>Задания</Button>
                  <Button
                    design="critical"
                    onClick={() => removeHandler(item.id)}
                  >
                    Удалить
                  </Button>
                </Groups>
              }
            >
              <Card.Title>{item.name}</Card.Title>
              <Card.Subtitle>
                <Groups>
                  <Badge>класс: {item.className}</Badge>
                  <Badge>пароль: {item.pwd}</Badge>
                </Groups>
              </Card.Subtitle>
            </Card>
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
                    <Badge>
                      {task.isFinished
                        ? `выполнено: ${parseDate(task.finishedOn)}`
                        : "не выполнено"}
                    </Badge>
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
        <Modal.Layout>
          <Modal.Head>
            <Modal.Title>{task?.name}</Modal.Title>
          </Modal.Head>
          <Modal.Body>
            <div style={{ width: "1024px", height: "608px" }}>
              <Container data={task?.result} showInvalid />
            </div>
          </Modal.Body>
        </Modal.Layout>
      </Modal>
    </Grid.Row>
  );
}
