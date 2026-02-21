import { useEffect, useState } from "react";
import api from "../Services/api";
import { useNavigate } from "react-router-dom";
import { 
  IoTrashOutline, 
  IoPencilOutline, 
  IoCheckmarkCircle, 
  IoEllipseOutline,
  IoLogOutOutline,
  IoSaveOutline,
  IoCloseOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoPersonCircleOutline
} from "react-icons/io5";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // State
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'active', 'completed'

  // Editing State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // ==============================
  // INITIALIZATION
  // ==============================
  useEffect(() => {
    const initDashboard = async () => {
      try {
        // Fetch user profile and tasks concurrently
        const [userRes, tasksRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/tasks")
        ]);
        setUser(userRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        if (error.response?.status === 401) handleLogout();
        console.error("Initialization failed", error);
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, []);

  // ==============================
  // CRUD OPERATIONS
  // ==============================
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await api.post("/tasks", { title });
      setTasks([...tasks, res.data]);
      setTitle("");
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const toggleComplete = async (task) => {
    try {
      setTasks(tasks.map(t => t._id === task._id ? { ...t, completed: !t.completed } : t));
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return setEditingId(null);
    try {
      setTasks(tasks.map(t => t._id === id ? { ...t, title: editTitle } : t));
      setEditingId(null);
      await api.put(`/tasks/${id}`, { title: editTitle });
    } catch (error) {
      console.error("Failed to update title", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      setTasks(tasks.filter(t => t._id !== id));
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ==============================
  // DERIVED STATE (Search & Filter)
  // ==============================
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterStatus === "all" ? true :
      filterStatus === "completed" ? task.completed : 
      !task.completed;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans">
      
      {/* Top Navbar / User Profile */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <IoPersonCircleOutline className="text-4xl text-indigo-600" />
          {user ? (
            <div>
              <h2 className="font-bold text-gray-800 leading-tight">{user.name}</h2>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          ) : (
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          )}
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          <IoLogOutOutline className="mr-2 text-lg" /> Logout
        </button>
      </nav>

      <div className="max-w-3xl mx-auto py-8 px-4">
        
        {/* Create Task Form */}
        <form onSubmit={addTask} className="flex gap-3 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <input
            className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-700 placeholder-gray-400"
            placeholder="What needs to be done today?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!title.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            Add Task
          </button>
        </form>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 group">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 text-lg transition-colors" />
            <input 
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-gray-700 shadow-sm"
            />
          </div>
          
          <div className="relative min-w-[160px]">
            <IoFilterOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-11 pr-8 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-gray-700 shadow-sm appearance-none cursor-pointer"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 font-medium animate-pulse">Loading dashboard...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-16 px-6 bg-gray-50 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-3xl">📝</div>
              <p className="text-gray-500 font-medium">No tasks found matching your criteria.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredTasks.map((task) => (
                <li 
                  key={task._id} 
                  className={`group flex justify-between items-center p-5 transition-all duration-200 ${
                    task.completed ? "bg-gray-50/50" : "hover:bg-indigo-50/30"
                  }`}
                >
                  <div className="flex items-center flex-1 overflow-hidden">
                    {/* Checkbox */}
                    <button 
                      onClick={() => toggleComplete(task)}
                      className={`text-2xl mr-4 flex-shrink-0 transition-all hover:scale-110 active:scale-95 ${
                        task.completed ? "text-green-500" : "text-gray-300 hover:text-indigo-400"
                      }`}
                    >
                      {task.completed ? <IoCheckmarkCircle /> : <IoEllipseOutline />}
                    </button>

                    {/* Title or Edit Input */}
                    {editingId === task._id ? (
                      <div className="flex-1 flex items-center mr-4">
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(task._id)}
                          className="w-full border-b-2 border-indigo-500 outline-none px-1 py-1 text-gray-800 bg-transparent font-medium"
                        />
                      </div>
                    ) : (
                      <span className={`flex-1 truncate font-medium text-[1.05rem] transition-all ${
                        task.completed ? "text-gray-400 line-through" : "text-gray-700"
                      }`}>
                        {task.title}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex-shrink-0">
                    {editingId === task._id ? (
                      <>
                        <button onClick={() => saveEdit(task._id)} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition" title="Save">
                          <IoSaveOutline className="text-xl" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition" title="Cancel">
                          <IoCloseOutline className="text-xl" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEditing(task)} 
                          className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition" 
                          title="Edit"
                          disabled={task.completed}
                        >
                          <IoPencilOutline className={`text-xl ${task.completed ? 'opacity-30 cursor-not-allowed' : ''}`} />
                        </button>
                        <button onClick={() => deleteTask(task._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition" title="Delete">
                          <IoTrashOutline className="text-xl" />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}