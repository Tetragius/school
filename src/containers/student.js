import React, { useCallback, useEffect, useState } from "react";
import { Grid, Groups, Modal } from "vienna-ui";
import { getTasksForStudent, updateTaskForStudent } from "../services/EP";
import { useAuth } from "../services/Auth";
import Task from "./task";
import { StudentTak } from "../components/studentTask";

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
            <StudentTak key={task.id} item={task} onOpen={showModal} />
          ))}
        </Groups>
      </Grid.Col>
      <Modal isOpen={modal && !!task} onClose={() => setModal(false)}>
        <Task task={task} onSave={handleSave} />
      </Modal>
    </Grid.Row>
  );
}
