import React, { Component } from "react";

const Result = (props) => {
    const resultClass = props.isGameFinished ? "result-visible" : "";
    const spanContent = props.result ? "You won!" : "You lost";

    return (
        <div className={"result " + resultClass}>
            <span>{spanContent}</span>
            <button onClick={props.restartGame}>RESTART GAME</button>
        </div>
    );
};

export default Result;
