import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import FileManager from "./FileManager";
import { fetchFiles } from "../redux/filesSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    dispatch(fetchFiles());

    // Получить информацию о пользователе из localStorage
    const userString = localStorage.getItem("user");

    if (userString && userString !== "undefined") {
      try {
        const user = JSON.parse(userString);
        console.log(user);
        if (user && user.name) {
          setUserName(user.name);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("404 user in localStorage");
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <h1>
        Привет, {userName}! С легкостью используйте наш сервис для сохранения и
        извлечения файлов.
      </h1>
      <button style={{ float: "right" }} onClick={handleLogout}>
        Выйти
      </button>

      <FileManager />
    </div>
  );
};

export default Dashboard;
