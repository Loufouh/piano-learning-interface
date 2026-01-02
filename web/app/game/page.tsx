"use server";

import GameManager from "./GameManager";

export default async function Home() {
    return (
        <div className="flex justify-center bg-black h-screen">
            <GameManager />
        </div >
    );
}