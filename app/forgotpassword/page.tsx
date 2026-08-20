"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("𝐖𝐞'𝐥𝐥 𝐬𝐞𝐧𝐝 𝐚 𝐩𝐚𝐬𝐬𝐰𝐨𝐫𝐝 𝐫𝐞𝐬𝐞𝐭 𝐥𝐢𝐧𝐤 𝐭𝐨 " + email);
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>𝐅𝐨𝐫𝐠𝐨𝐭 𝐏𝐚𝐬𝐬𝐰𝐨𝐫𝐝</h1>

        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button>𝐒𝐞𝐧𝐝 𝐑𝐞𝐬𝐞𝐭 𝐋𝐢𝐧𝐤</button>
      </form>
    </div>
  );
}