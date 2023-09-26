import { useState, useEffect } from "react";

export const useGame = () => {
    const [flagCounter, setFlagCounter] = useState(10);
    const [cells, setCells] = useState([]);
    const [gameFinished, setGameFinished] = useState(false);
    const [isWin, setIsWin] = useState(false);

    return {
        flagCounter,
        cells,
        gameFinished,
        isWin,
        setFlagCounter,
        setCells,
        setGameFinished,
        setIsWin,
    };
};
