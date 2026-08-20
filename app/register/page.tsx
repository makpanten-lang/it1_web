"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("𝐑𝐞𝐠𝐢𝐬𝐭𝐞𝐫 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥");
      router.push("/login");
    } else {
      alert("𝐑𝐞𝐠𝐢𝐬𝐭𝐞𝐫 𝐟𝐚𝐢𝐥𝐞𝐝");
    }
  }


  return (

    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2> 𝐑𝐞𝐠𝐢𝐬𝐭𝐞𝐫 </h2>
        <input
          placeholder="𝗡𝗮𝗺𝗲"
          type="text"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="𝐄𝐦𝐚𝐢𝐥"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="𝐏𝐚𝐬𝐬𝐰𝐨𝐫𝐝"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          placeholder="𝐏𝐡𝐨𝐧𝐞 𝐍𝐮𝐦𝐛𝐞𝐫"
          type="text"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button>Register</button>
      </form>
    </div>
  );
}