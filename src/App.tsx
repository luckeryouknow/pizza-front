import './App.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Menu from "./components/Menu";
import Orders from "./components/Orders";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [user, setUser] = useState<null | { id: string, email: string, role: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user")))
  }, [])

  return (
    <>
      {user?.role === "DEFAULT_USER" && (<Menu />)}
      {user?.role === "COURIER" && (<Orders user={user} />)}
      {user?.role === "ADMIN" && (<AdminPanel />)}
      {user === null && navigate('/sign-in')}
    </>
  )
}

export default App
