"use client";

import { FormEvent, useState } from "react";

export default function BlogForm() {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function createSlug(value: string) {
        return value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9ก-๙-]/g, "");
    }

    function handleTitleChange(value: string) {
        setTitle(value);
        setSlug(createSlug(value));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSubmitting(true);
            setMessage("");

            const response = await fetch("/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    slug,
                    content,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message ?? "𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐚𝐝𝐝 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲");
            }

            setMessage("𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲 𝐚𝐝𝐝𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲");
            setTitle("");
            setSlug("");
            setContent("");
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝"
            );
        } finally {
            setSubmitting(false);
        }
    }


    return (
        <div className="page">
            <div className="card">
                <h1> 𝐓𝐢𝐭𝐥𝐞 𝐃𝐚𝐭𝐚</h1>
                {message && (
                    <p>
                        {message}
                    </p>
                )}
                <form onSubmit={handleSubmit}>
                    <label>𝐓𝐢𝐭𝐥𝐞 𝐍𝐚𝐦𝐞</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(event) =>
                            handleTitleChange(event.target.value)
                        }
                        required
                    />

                    <label>𝐒𝐥𝐮𝐠</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(event) => setSlug(event.target.value)}
                        className="w-full rounded-lg border px-3 py-2"
                        required
                    />

                    <label> 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧 </label>
                    <textarea
                        value={content}
                        onChange={(event) =>
                            setContent(event.target.value)
                        }
                        placeholder="𝐄𝐧𝐭𝐞𝐫 𝐝𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧"
                    />


                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "𝐒𝐚𝐯𝐢𝐧𝐠..." : "𝐀𝐝𝐝 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲"}
                    </button>
                </form>
            </div>
        </div>
    );
}