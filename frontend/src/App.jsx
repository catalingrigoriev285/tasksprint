import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PrivateRouter from "./routes/PrivateRoute";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageTasks from "./pages/Admin/Tasks/ManageTasks";
import CreateTask from "./pages/Admin/Tasks/CreateTask";
import ManageUsers from "./pages/Admin/Users/ManageUsers";

import UserDashboard from "./pages/Users/UserDashboard";
import MyTasks from "./pages/Users/Tasks/MyTasks";

import ViewTaskDetails from "./pages/Users/Tasks/ViewTaskDetails";

import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";

export const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Admin Routes */}
                    <Route element={<PrivateRouter allowedRoles={["admin"]} />}>
                        <Route
                            path="/admin/dashboard"
                            element={<AdminDashboard />}
                        />

                        <Route path="/admin/tasks" element={<ManageTasks />} />

                        <Route
                            path="/admin/create-task"
                            element={<CreateTask />}
                        />

                        <Route path="/admin/users" element={<ManageUsers />} />
                    </Route>

                    {/* User Routes */}
                    <Route element={<PrivateRouter allowedRoles={["user"]} />}>
                        <Route
                            path="/user/dashboard"
                            element={<UserDashboard />}
                        />

                        <Route path="/user/my-tasks" element={<MyTasks />} />

                        <Route
                            path="/user/task-details/:id"
                            element={<ViewTaskDetails />}
                        />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
};

export default App;
