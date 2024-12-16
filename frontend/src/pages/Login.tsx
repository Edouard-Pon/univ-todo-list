import {useAppDispatch, useAppSelector} from "../store/hooks.ts";
import {clearStatus, selectStatus} from "../store/user.ts";
import {useEffect, useState} from "react";
import {login} from "../store/userThunks.ts";
import {useNavigate} from "react-router-dom";

const Login = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    dispatch(login({ email, password }))
  }

  useEffect(() => {
    if (status === 'succeeded') {
      navigate('/');
      dispatch(clearStatus());
    }
  }, [status, navigate]);

  return (
    <div>
      <h1>Login</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
