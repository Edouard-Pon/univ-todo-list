import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from "../store/hooks.ts";
import { logout, selectAuth } from '../store/user'

function Navigation() {
  const isAuthenticated = useAppSelector(selectAuth)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="text-white">Home</Link>
        </li>
        {isAuthenticated ? (
          <li>
            <button onClick={handleLogout} className="text-white">Logout</button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" className="text-white">Login</Link>
            </li>
            <li>
              <Link to="/register" className="text-white">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navigation
