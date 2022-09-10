import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/authContext";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(true);
  const [message, setMessage] = useState("");
  const [display, setDisplay] = useState("none");

  const authCtx = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();

    const body = {
      username,
      password,
    };

    const url = "http://localhost:4000";

    axios
      .post(register ? `${url}/register` : `${url}/login`, body)
      .then((res) => {
        console.log(res.data);
        authCtx.login(res.data.token, res.data.exp, res.data.userId);
      })
      //whhat is the after Auth in solution, also
      .catch((err) => {
        setMessage(err.response.data);
        setDisplay("block");
        setPassword("");
        setUsername("");
        console.log("error");
      }); 

    console.log("submitHandler called");
  };

  return (
    <main>
      <h1>Welcome!</h1>
      <form className="form auth-form" onSubmit={submitHandler}>
        <input
          className="form-input"
          type="text"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="form-input"
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="form-btn">{register ? "Sign Up" : "Login"}</button>
      </form>
      <p style={{display: display}} className='auth-msg'>{message}</p>
      <button
        className="form-btn"
        onClick={() => setRegister(!register)}
      >
        Need to {register ? "Login" : "Sign Up"}?
      </button>
    </main>
  );
};
//where to put the console.oogs(can they got in the jsx)
export default Auth;
