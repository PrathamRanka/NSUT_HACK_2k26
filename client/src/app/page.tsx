"use client";

import { useState } from "react";
import { UserRole } from "@fds/common";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.OFFICER);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    // Simulate network delay
    login(selectedRole);
    router.push("/dashboard");
    setIsLoggingIn(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-sm border-t-4 border-blue-800">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">PFMS Intelligence</h1>
            <p className="text-sm text-gray-600 uppercase tracking-widest">Public Fraud Detection System</p>
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-16 bg-orange-500 rounded"></div>
              <div className="h-1 w-16 bg-white rounded mx-1 border"></div>
              <div className="h-1 w-16 bg-green-600 rounded"></div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Select Access Role
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent bg-white text-gray-900"
              >
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>
                    {role.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 text-sm text-blue-800 mb-4">
              <p className="font-semibold mb-1">Security Notice</p>
              <p>Access to this system is restricted to authorized officers only. All activities are monitored and audited.</p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 ${isLoggingIn ? "opacity-75 cursor-wait" : ""
                }`}
            >
              {isLoggingIn ? "Authenticating..." : "Secure Login"}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            For technical support, contact the NIC Helpdesk.
            <br />
            v1.0.0 (Build 2026.1)
          </p>
        </div>
      </div>
    </main>
  );
}
