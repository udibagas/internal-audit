import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AuditList from '@/pages/AuditList';
import AuditDetail from '@/pages/AuditDetail';
import UserList from '@/pages/UserList';
import RoleList from '@/pages/RoleList';
import DepartmentList from '@/pages/DepartmentList';
import AppLayout from '@/components/Layout/AppLayout';
import AuditAreasList from '@/pages/AuditAreasList';
import AuditAreasForm from '@/pages/AuditAreasForm';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/audits" element={<AuditList />} />
                  <Route path="/audits/:id" element={<AuditDetail />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/roles" element={<RoleList />} />
                  <Route path="/departments" element={<DepartmentList />} />
                  <Route path="/audit-areas" element={<AuditAreasList />} />
                  <Route path="/audit-areas/:id" element={<AuditAreasForm />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
