import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks.ts';
import { selectUser } from '../store/user.ts';
import { createEnterprise, createTeam, addTaskToTeam, addWorkerToTeam } from '../store/enterpriseThunks';
import { selectEnterprise, selectEnterpriseStatus } from '../store/enterprise.ts';

const Enterprise_and_teams = () => {
  const user = useAppSelector(selectUser);
  const enterprise = useAppSelector(selectEnterprise);
  const status = useAppSelector(selectEnterpriseStatus);
  const dispatch = useAppDispatch();

  const [enterpriseName, setEnterpriseName] = useState('');
  const [enterpriseAddress, setEnterpriseAddress] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [teamName, setTeamName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskStatus] = useState(false);
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  useEffect(() => {
    if (user?.email) {
      // Fetch enterprise details if user has an enterprise
      // Dispatch actions to fetch workers and teams for the enterprise
    }
  }, [user]);

  const handleCreateEnterprise = () => {
    console.log(user.email)
    dispatch(createEnterprise({ name: enterpriseName, address: enterpriseAddress, email: user.email }));
  };

  const handleCreateTeam = () => {
    dispatch(createTeam({ enterpriseId: enterprise._id, teamData: { name: teamName } }));
  };

  const handleAddTaskToTeam = (teamId: string) => {
    const task = { name: taskName, status: taskStatus, startDate: new Date(taskStartDate), dueDate: new Date(taskDueDate) };
    dispatch(addTaskToTeam({ enterpriseId: enterprise._id, teamId, name: task }));
  };

  const handleAddWorkerToTeam = (teamId: string) => {
    dispatch(addWorkerToTeam({ enterpriseId: enterprise._id, teamId, workerId: workerEmail }));
    setWorkerEmail('');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!enterprise.name) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Your Enterprise</h1>
        <input
          type="text"
          placeholder="Enterprise Name"
          value={enterpriseName}
          onChange={(e) => setEnterpriseName(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Enterprise Address"
          value={enterpriseAddress}
          onChange={(e) => setEnterpriseAddress(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          onClick={handleCreateEnterprise}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Enterprise
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{enterprise.name}</h1>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Workers</h2>
      <ul className="list-disc pl-5 mb-4">
        {enterprise.teams.flatMap(team => team.workers).map((worker, index) => (
          <li key={index}>{worker}</li>
        ))}
      </ul>
      <div className="mb-4">
        <input
          type="email"
          placeholder="Worker Email"
          value={workerEmail}
          onChange={(e) => setWorkerEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          onClick={() => handleAddWorkerToTeam(enterprise._id)}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Worker
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-800">Teams</h2>
      {enterprise.teams.map((team, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-bold mb-2 text-gray-800">{team.name}</h3>
          <ul className="list-disc pl-5 mb-2">
            {team.tasks.map((task, taskIndex) => (
              <li key={taskIndex}>
                <input
                  type="checkbox"
                  checked={task.status}
                  onChange={() => handleAddTaskToTeam(team._id)}
                />
                {task.name}
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={taskStartDate}
            onChange={(e) => setTaskStartDate(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="date"
            placeholder="Due Date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            onClick={() => handleAddTaskToTeam(team._id)}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
      ))}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          onClick={handleCreateTeam}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Team
        </button>
      </div>
    </div>
  );
};

export default Enterprise_and_teams;