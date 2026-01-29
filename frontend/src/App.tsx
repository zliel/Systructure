//FIXME: Frontend

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import EditorLayout from './layouts/EditorLayout';
import Dashboard from './pages/Dashboard';
import FlowEditor from './pages/FlowEditor';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
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
