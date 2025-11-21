import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserDataContext.js"; 

const Auth = ({ type }) => {
  const { setUser } = useUser(); // Get setUser from context
  const [isLogin, setIsLogin] = useState(type === "login");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await axios.post("http://localhost:8080/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        setUser(response.data); 
        alert("Logged in successfully");
      } else {
        const response = await axios.post("http://localhost:8080/api/auth/signUp", formData);
        setUser(response.data); 
        alert("Signup successful");
      }
    } catch (err) {
      alert(isLogin ? "Login failed" : "Signup failed");
    }

    setLoading(false);
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-4">

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                type="password"
                className="w-full border rounded-lg px-3 py-2"
              />
            </>
          )}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-blue-600 underline mt-2"
        >
          {isLogin ? "Create a new account" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;