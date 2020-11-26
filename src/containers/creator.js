import React, { useCallback, useEffect, useState } from "react";
import { Card, Switcher, Modal, Button, Tabs, Groups } from "vienna-ui";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import { Container } from "../components/container";
import { Redactor, prepare } from "../components/readctor";
import { SaveTaskForm } from "../forms/saveTask";
import { db } from "../App";

const I = styled.i`
  font-size: 12px;
  * {
    font-size: 12px;
  }
`;

export default function Creator() {
  const [task, setTask] = useState({ name: "Новое задание", body: "" });

  const [data, setData] = useState(prepare(task.body));
  const [showInvalid, setShowInvalid] = useState(false);
  const [tab, setTab] = useState("edit");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  let { id } = useParams();
  let history = useHistory();

  useEffect(() => {
    if (id) {
      db.getTask(id).then((task) => {
        setTask(task);
        setData(prepare(task.body));
      });
    }
  }, [id]);

  const handle = useCallback(
    (_value, _data) => {
      setTask({ ...task, body: _value });
      setData(_data);
    },
    [task]
  );

  const handleCheckbox = useCallback(() => {
    setShowInvalid(!showInvalid);
  }, [showInvalid]);

  const handleShowDialog = useCallback(() => {
    setShowSaveDialog(true);
  }, []);

  const handleChange = useCallback(
    (value, idx) => {
      data[idx]["value"] = value;
      setData([...data]);
    },
    [data]
  );

  const handleSave = useCallback(
    (name) => {
      if (!id) {
        db.addTask(name, task.body);
      } else {
        db.updatetask(id, name, task.body);
      }
      setShowSaveDialog(false);
      history.push("/list");
    },
    [task, id, history]
  );

  console.log(tab);

  return (
    <>
      <Card
        footer={
          <Groups justifyContent="flex-end">
            {tab === "edit" && (
              <I>
                Выделите текст или область.
                <ul>
                  <li>
                    Нажмите <b>CTRL+Q</b> - пропущеные буквы
                  </li>
                  <li>
                    Нажмите <b>CTRL+W</b> - слитно/раздельно
                  </li>
                </ul>
              </I>
            )}
            <Button design="accent" onClick={handleShowDialog}>
              Сохранить
            </Button>
          </Groups>
        }
      >
        <Card.Subtitle>
          <Tabs value={tab} onChange={(e, value) => setTab(value)}>
            <Tabs.Tab value={"edit"}>Редактирование</Tabs.Tab>
            <Tabs.Tab value={"preview"}>Предпросмотр</Tabs.Tab>
          </Tabs>
        </Card.Subtitle>
        {tab === "edit" && (
          <Groups
            design="vertical"
            style={{ paddingTop: "16px", paddingBottom: "16px" }}
          >
            <div style={{ width: "1024px", height: "608px" }}>
              <Redactor onChange={handle} value={task.body} />
            </div>
          </Groups>
        )}
        {tab === "preview" && (
          <Groups
            design="vertical"
            style={{ paddingTop: "16px", paddingBottom: "16px" }}
          >
            <Switcher checked={showInvalid} onChange={handleCheckbox}>
              Показать ошибки
            </Switcher>
            <div style={{ width: "1024px", height: "608px" }}>
              <Container
                data={data}
                showInvalid={showInvalid}
                onChange={handleChange}
              />
            </div>
          </Groups>
        )}
      </Card>
      <Modal isOpen={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <Modal.Layout>
          <Modal.Head>
            <Modal.Title>Добавить задание</Modal.Title>
          </Modal.Head>
          <Modal.Body>
            <SaveTaskForm onOk={handleSave} name={task.name} />
          </Modal.Body>
        </Modal.Layout>
      </Modal>
    </>
  );
}
