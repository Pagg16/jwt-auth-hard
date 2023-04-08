import React, { FC, useEffect, useContext, useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import { Context } from ".";
import { observer } from "mobx-react-lite";
import { IUser } from "./models/IUsers";
import UserService from "./services/UserService";

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setusers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  async function getusers() {
    try {
      const response = await UserService.fetchUsers();
      setusers(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  if (store.isLoading) {
    return <div>Загрузка</div>;
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />;
        <button onClick={() => getusers()}>
          Получить список пользователей
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>
        {store.isAuth ? "Пользователь авторизован" : "Требуется авторизация"}
      </h1>
      <h1>
        {store.user.isActivated
          ? "Аккаунт активирован"
          : "Требуется активация аккаунта"}
      </h1>
      <button
        onClick={() => {
          store.logout();
        }}
      >
        Выйти
      </button>
      <div>
        <button onClick={() => getusers()}>
          Получить список пользователей
        </button>
        {users.map((user) => (
          <div key={user.email}>{user.email}</div>
        ))}
      </div>
    </div>
  );
};

export default observer(App);
