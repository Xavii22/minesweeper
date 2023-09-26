import React, { useState, useEffect } from "react";
import { hot } from "react-hot-loader";
import "./App.css";
import Board from "./components/Board";
import Cell from "./components/Cell";
import Flag from "./components/Flag";
import Result from "./components/Result";
import { useGame } from "./components/useGame";

const App = () => {
    const {
        flagCounter,
        cells,
        gameFinished,
        isWin,
        setFlagCounter,
        setCells,
        setGameFinished,
        setIsWin,
    } = useGame();

    const shuffleArray = (array) => {
        const shuffledArray = [...array];

        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [
                shuffledArray[j],
                shuffledArray[i],
            ];
        }

        return shuffledArray;
    };

    const printFlag = (e, index) => {
        e.preventDefault();

        if (gameFinished) return;

        const updatedCells = [...cells];
        if (!updatedCells[index].isBuried) return;

        if (updatedCells[index].isFlagged == false && flagCounter > 0) {
            updatedCells[index].isFlagged = true;
            setFlagCounter((prevCounter) => prevCounter - 1);
        } else if (updatedCells[index].isFlagged == true) {
            updatedCells[index].isFlagged = false;
            setFlagCounter((prevCounter) => prevCounter + 1);
        }

        setCells(updatedCells);
    };

    const unburyCell = (index) => {
        if (gameFinished) return;

        const clickedCell = cells[index];
        if (!clickedCell.isFlagged && clickedCell.isBuried) {
            clickedCell.isBuried = false;

            if (!clickedCell.isSafe) {
                clickedCell.content = "💣";
                setGameFinished(true);
            } else {
                const row = Math.floor(index / 10);
                const col = index % 10;
                let mineNeighborCount = 0;

                const neighborPositions = [
                    [-1, -1],
                    [-1, 0],
                    [-1, 1],
                    [0, -1],
                    [0, 1],
                    [1, -1],
                    [1, 0],
                    [1, 1],
                ];

                for (const [dx, dy] of neighborPositions) {
                    const newRow = row + dx;
                    const newCol = col + dy;

                    if (
                        newRow >= 0 &&
                        newRow < 10 &&
                        newCol >= 0 &&
                        newCol < 10
                    ) {
                        const neighborIndex = newRow * 10 + newCol;
                        const neighborCell = cells[neighborIndex];

                        if (neighborCell.isFlagged) continue;

                        if (!neighborCell.isSafe) {
                            mineNeighborCount++;
                        }
                    }
                }

                clickedCell.content = mineNeighborCount;

                if (mineNeighborCount === 0) {
                    for (const [dx, dy] of neighborPositions) {
                        const newRow = row + dx;
                        const newCol = col + dy;

                        if (
                            newRow >= 0 &&
                            newRow < 10 &&
                            newCol >= 0 &&
                            newCol < 10
                        ) {
                            const neighborIndex = newRow * 10 + newCol;
                            const neighborCell = cells[neighborIndex];

                            if (
                                !neighborCell.isBuried ||
                                neighborCell.isFlagged
                            )
                                continue;

                            unburyCell(neighborIndex);
                        }
                    }
                }
            }

            setCells([...cells]);
            const unburiedSafeCells = cells.filter(
                (cell) => cell.isBuried && cell.isSafe
            );

            if (unburiedSafeCells.length === 0) {
                setGameFinished(true);
                setIsWin(true);
            }
        }
    };

    const restartGame = () => {
        setFlagCounter(10);
        setGameFinished(false);

        const newCells = Array.from({ length: 100 }, (_, index) => ({
            isSafe: index >= 10,
            isFlagged: false,
            isBuried: true,
        }));

        const shuffledCells = shuffleArray(newCells);

        setCells(shuffledCells);
    };

    useEffect(() => {
        const initializeCells = () => {
            const newCells = Array.from({ length: 100 }, (_, index) => ({
                isSafe: index >= 10,
                isFlagged: false,
                isBuried: true,
            }));

            const shuffledCells = shuffleArray(newCells);

            setCells(shuffledCells);
            console.log(shuffledCells);
        };

        initializeCells();
    }, [setCells]);

    return (
        <>
            <Flag counter={flagCounter} />

            <Board>
                {cells.map((cell, index) => (
                    <Cell
                        key={index}
                        content={
                            cell.isFlagged
                                ? "🚩"
                                : cell.isBuried
                                ? ""
                                : cell.isBomb
                                ? "💣"
                                : cell.content
                        }
                        unburyCell={() => unburyCell(index)}
                        printFlag={(e) => printFlag(e, index)}
                        isBuried={cell.isBuried}
                    />
                ))}
            </Board>
            <Result
                result={isWin}
                isGameFinished={gameFinished}
                restartGame={restartGame}
            />
        </>
    );
};

export default hot(module)(App);
