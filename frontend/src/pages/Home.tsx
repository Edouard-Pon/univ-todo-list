import { useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks.ts';
import { selectUser } from '../store/user.ts';
import {api} from "../services/api.ts";

const Home = () => {
  const user = useAppSelector(selectUser);
  const [teams, setTeams] = useState<{ name: string, tasks: { name: string, status: boolean }[] }[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      if (user) {
        try {
          const response = await api.get(`/api/teams?userId=${user._id}`);
          setTeams(response.data);
        } catch (error) {
          console.error('Error fetching teams:', error);
        }
      }
    };

    fetchTeams();
  }, [user]);

  const handleTaskStatusChange = (teamIndex: number, taskIndex: number) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].tasks[taskIndex].status = !updatedTeams[teamIndex].tasks[taskIndex].status;
    setTeams(updatedTeams);
    // Add logic to update task status in the backend
  };

  const handleEditTask = (teamIndex: number, taskIndex: number) => {
    // Add logic to open a popup for editing the task
  };

  const handleDeleteTask = (teamIndex: number, taskIndex: number) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].tasks.splice(taskIndex, 1);
    setTeams(updatedTeams);
    // Add logic to delete the task in the backend
  };

  return (
    <div>
      <div>
        {teams.map((team, teamIndex) => (
          <div key={teamIndex}>
            <h2>{team.name}</h2>
            <ul>
              {team.tasks.map((task, taskIndex) => (
                <li key={taskIndex}>
                  <input
                    type="checkbox"
                    checked={task.status}
                    onChange={() => handleTaskStatusChange(teamIndex, taskIndex)}
                  />
                  {task.name}
                  <button onClick={() => handleEditTask(teamIndex, taskIndex)}>✏️</button>
                  <button onClick={() => handleDeleteTask(teamIndex, taskIndex)}>❌</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;