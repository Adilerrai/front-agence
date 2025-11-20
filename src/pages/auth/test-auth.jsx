import React, { useState } from "react";
import { useLoginMutation } from "@/store/api/auth/authApiSlice";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const TestAuth = () => {
  const [username, setUsername] = useState("DashSpace");
  const [password, setPassword] = useState("DashSpace");
  const [login, { isLoading }] = useLoginMutation();
  const authState = useSelector((state) => state.auth);

  const handleTestLogin = async () => {
    try {
      console.log("Testing login with:", { username, password });
      const response = await login({ username, password });
      console.log("Test login response:", response);
      
      if (response.error) {
        toast.error(`Error: ${response.error.data?.error || response.error.message}`);
      } else if (response.data) {
        toast.success("Login test successful!");
        console.log("Token:", response.data.token);
        console.log("User:", response.data.user);
      }
    } catch (error) {
      console.error("Test login error:", error);
      toast.error("Test login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Test Authentication</h2>
      
      <div className="space-y-4">
        <Textinput
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        
        <Textinput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        
        <Button
          text="Test Login"
          className="btn-primary w-full"
          onClick={handleTestLogin}
          isLoading={isLoading}
        />
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded">
        <h3 className="font-semibold mb-2">Default Test Credentials:</h3>
        <p><strong>Email:</strong> DashSpace@gmail.com</p>
        <p><strong>Password:</strong> DashSpace</p>
      </div>
    </div>
  );
};

export default TestAuth;
