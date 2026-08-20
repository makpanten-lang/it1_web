
"use client";


import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Login() {

  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      alert("𝐋𝐨𝐠𝐢𝐧 𝐟𝐚𝐢𝐥𝐞𝐝");
    }
  }



  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="font-bold"> เข้าสู่ระบบ</h2>
        <input
          placeholder="𝐄𝐦𝐚𝐢𝐥"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="𝐏𝐚𝐬𝐬𝐰𝐨𝐫𝐝"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button>Login</button>

        <p>
          <Link href="/forgotpassword">𝐅𝐨𝐫𝐠𝐨𝐭𝐩𝐚𝐬𝐬𝐰𝐨𝐫𝐝?</Link>
        </p>

        <p>
          No account? <Link href="/𝐑𝐞𝐠𝐢𝐬𝐭𝐞𝐫">
𝐑𝐞𝐠𝐢𝐬𝐭𝐞𝐫?</Link>
        </p>
      </form>
    </div>
  );
}