import {useAppSelector} from "../store/hooks.ts";
import {selectUser} from "../store/user.ts";


const Home = () => {
  const user = useAppSelector(selectUser);

  return (
    <div>
      <h1>Home - Hello World!</h1>
      <p>ID: {user?._id}</p>
      <p>Welcome {user?.email}</p>
    </div>
  )
}

export default Home
