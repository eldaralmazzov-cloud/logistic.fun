import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, isLoading } = useAuth();

    if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!token) return <Navigate to="/login" />;

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <LanguageProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                            <Route index element={<Dashboard />} />
                            <Route path="products" element={<Products />} />
                            <Route path="products/:id" element={<ProductDetail />} />
                            <Route path="logistics" element={<Products title="Logistics Tracking" />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </LanguageProvider>
        </AuthProvider>
    );
};

export default App;
