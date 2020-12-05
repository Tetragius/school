import React, { useCallback, useEffect, useState } from "react";
import { Card, Grid, Groups, Button, Badge, Modal } from "vienna-ui";
import { getTasksForStudent, updateTaskForStudent } from "../services/EP";
import { useAuth } from "../services/Auth";
import Task from "./task";

const parseDate = (str) => {
  return str.replace(
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(:.*)/i,
    "$3.$2.$1 $4:$5"
  );
};

export default function Student() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [modal, setModal] = useState(false);
  const { id } = useAuth();

  useEffect(() => {
    getTasksForStudent(id).then(setTasks);
  }, [id]);

  const showModal = useCallback(async (task) => {
    await setTask(task);
    setModal(true);
  }, []);

  const handleSave = useCallback(
    async (result) => {
      await updateTaskForStudent(id, task.id, result);
      setModal(false);
      getTasksForStudent(id).then(setTasks);
    },
    [task, id]
  );

  return (
    <Grid.Row align="center">
      <Grid.Col size={10}>
        <Groups design="vertical">
          {tasks.map((task, idx) => (
            <Card
              title={task.name}
              footer={
                <Groups justifyContent="flex-end">
                  <Button onClick={() => showModal(task)}>
                    {!task.isFinished ? "Выполнить" : "Просмотреть"}
                  </Button>
                </Groups>
              }
              key={idx}
            >
              <Badge>
                {task.isFinished
                  ? `выполнено: ${parseDate(task.finishedOn)}`
                  : "новое"}
              </Badge>
            </Card>
          ))}
        </Groups>
      </Grid.Col>
      <Modal isOpen={modal && !!task} onClose={() => setModal(false)}>
        <Task task={task} onSave={handleSave} />
      </Modal>
    </Grid.Row>
  );
}
