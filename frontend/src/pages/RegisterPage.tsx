import { useState } from "react";
import { registerUser } from "../api/auth";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password_hash: "",
    first_name: "",
    last_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Register Success!");
    } catch (err) {
      alert("Register Failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
        <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password_hash" onChange={handleChange} placeholder="Password" required />
        <input type="text" name="first_name" onChange={handleChange} placeholder="First Name" />
        <input type="text" name="last_name" onChange={handleChange} placeholder="Last Name" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
