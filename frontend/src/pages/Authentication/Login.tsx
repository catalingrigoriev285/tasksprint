import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { AUTH_ENDPOINTS } from "../../utils/apiPaths";
import { setToken, setUser } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(AUTH_ENDPOINTS.LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            
            // Backend returns user data directly (not nested in user object)
            const userData = {
                id: data._id,
                name: data.username,
                email: data.email,
                role: data.role,
                profileImageURL: data.profileImageURL
            };
            
            if (data.token) setToken(data.token);
            setUser(userData);
            
            // Update auth context
            login(userData, data.token);
            
            // Navigate based on role
            if (data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (err: any) {
            setError(err.message || "Unexpected error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-8">
                            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                            <span className="text-2xl font-medium text-gray-900">TaskFlow</span>
                        </div>
                        <h1 className="text-2xl font-normal text-gray-900 mb-2">Sign in</h1>
                        <p className="text-sm text-gray-600">to continue to TaskFlow</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <Link to="/register" className="text-sm text-blue-600 hover:underline">
                                Create account
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-600 text-center">
                            <Link to="/" className="text-blue-600 hover:underline">
                                Back to home
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Branding */}
            <div className="hidden lg:flex flex-1 bg-gray-50 items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-normal text-gray-900 mb-4">
                        Manage tasks efficiently
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        Join teams worldwide who trust TaskFlow to organize their work and boost productivity.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
