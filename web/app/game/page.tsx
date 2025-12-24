"use server";

import GameCanvas from "./GameCanvas";

export default async function Home() {
    return (
        <div className="flex justify-center">
        <GameCanvas />
        </div >
    );
}