import React, { useCallback, useEffect, useState } from "react";
import { Card, Switcher, Modal, Button, Tabs, Groups, Hint } from "vienna-ui";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
import { Container } from "../components/container";
import { Redactor, prepare } from "../components/redactor";
import { SaveTaskForm } from "../forms/saveTask";
import { getTask, addTask, updatetask } from "../services/EP";

const I = styled.i`
  font-size: 12px;
  * {
    font-size: 12px;
  }
`;

export default function Creator() {
  const [task, setTask] = useState({ name: "Новое задание", body: "" });

  const [showInvalid, setShowInvalid] = useState(false);
  const [withSign, setWithSign] = useState(true);
  const [data, setData] = useState(prepare(task.body, withSign));
  const [tab, setTab] = useState("edit");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  let { id } = useParams();
  let history = useHistory();

  useEffect(() => {
    if (id) {
      getTask(id).then((task) => {
        setTask(task);
        setWithSign(task.withSign);
        setData(prepare(task.body, task.withSign));
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
        addTask(name, task.body, withSign);
      } else {
        updatetask(id, name, task.body, withSign);
      }
      setShowSaveDialog(false);
      history.push("/list");
    },
    [task, id, history, withSign]
  );

  const footerPart =
    tab === "edit" ? (
      <Groups>
        <Hint
          anchor="auto"
          header="Справка"
          content={
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
          }
        />
        <Switcher
          checked={withSign}
          onChange={(e, data) => setWithSign(data.value)}
        >
          Учитывать знаки
        </Switcher>
      </Groups>
    ) : (
      <Switcher checked={showInvalid} onChange={handleCheckbox}>
        Показать ошибки
      </Switcher>
    );

  return (
    <>
      <Card
        footer={
          <Groups justifyContent="flex-end">
            {footerPart}
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
              <Redactor
                onChange={handle}
                value={task.body}
                withSign={withSign}
              />
            </div>
          </Groups>
        )}
        {tab === "preview" && (
          <Groups
            design="vertical"
            style={{ paddingTop: "16px", paddingBottom: "16px" }}
          >
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
            <Modal.Title>Сохранить задание</Modal.Title>
          </Modal.Head>
          <Modal.Body>
            <SaveTaskForm onOk={handleSave} name={task.name} />
          </Modal.Body>
        </Modal.Layout>
      </Modal>
    </>
  );
}
