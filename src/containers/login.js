import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Groups,
  Card,
  FormField,
  InputPassword,
  Input,
  Button
} from "vienna-ui";
import { AuthProvider } from "../services/Auth";

export default function Login() {
  const history = useHistory();
  const [login, setLogin] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const loginProcess = useCallback(() => {
    setLoading(true);
    console.log(1);
    AuthProvider.auth(login, pwd)
      .then(() => {
        setLoading(false);
        history.replace("/");
      })
      .catch(() => {
        setLoading(false);
      });
  }, [login, pwd, history]);

  console.log(login, pwd);

  return (
    <div
      style={{
        position: "absolute",
        left: "calc(50% - 200px)",
        top: "calc(50% - 150px)",
        width: "400px",
        height: "300px"
      }}
    >
      <Card
        title="Вход"
        footer={
          <Groups justifyContent="flex-end">
            <Button loading={loading} design="accent" onClick={loginProcess}>
              Войти
            </Button>
          </Groups>
        }
      >
        <Groups design="vertical">
          <FormField style={{ width: "100%" }}>
            <FormField.Label>Логин</FormField.Label>
            <FormField.Content>
              <Input
                value={login}
                onChange={(e, data) => setLogin(data.value)}
              />
            </FormField.Content>
          </FormField>
          <FormField style={{ width: "100%" }}>
            <FormField.Label>Пароль</FormField.Label>
            <FormField.Content>
              <InputPassword
                value={pwd}
                onChange={(e, data) => setPwd(data.value)}
              />
            </FormField.Content>
          </FormField>
        </Groups>
      </Card>
    </div>
  );
}
