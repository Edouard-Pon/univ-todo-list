import {useAppDispatch, useAppSelector} from "../store/hooks.ts";
import {clearStatus, selectStatus} from "../store/user.ts";
import {useEffect, useState} from "react";
import {register} from "../store/userThunks.ts";
import {useNavigate} from "react-router-dom";

const Register = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    dispatch(register({ email, password }))
  }

  useEffect(() => {
    if (status === 'succeeded') {
      navigate('/');
      dispatch(clearStatus());
    }
  }, [status, navigate]);

  return (
    <div>
      <h1>Register</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  )
}

export default Register
