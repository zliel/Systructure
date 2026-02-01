//FIXME: Frontend

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import EditorLayout from './layouts/EditorLayout';
import Dashboard from './pages/Dashboard';
import FlowEditor from './pages/FlowEditor';
import NotFound from './pages/NotFound';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/editor',
    element: <EditorLayout />,
    children: [
      {
        path: ':projectId', // Dynamic route for project ID if we implement it, currently FlowEditor uses strict ID.
        element: <FlowEditor />,
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
