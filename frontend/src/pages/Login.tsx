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
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Login</h1>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button
        onClick={handleLogin}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login
      </button>
    </div>
  )
}

export default Login
