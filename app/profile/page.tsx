import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function profile() {

    const user = await getSession();

    if (!user) {
        redirect("/login");
    }

    return (
        <div >

            <h2>𝐏𝐫𝐨𝐟𝐢𝐥𝐞</h2>
            <p>𝐖𝐞𝐥𝐜𝐨𝐦𝐞: {user.name as string}</p>
            <p>𝐑𝐨𝐥𝐞: {user.role as string}</p>
            <p>𝐄𝐦𝐚𝐢𝐥: {user.email as string}</p>

        </div>
    );
}