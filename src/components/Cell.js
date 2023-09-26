import React from "react";

const Cell = (props) => {
    const cellClasses = `cell ${props.isBuried ? "cell-buried" : "cell-unburied"}`;

    return (
        <div
            className={cellClasses}
            onClick={props.unburyCell}
            onContextMenu={props.printFlag}
        >
            {props.content}
        </div>
    );
};

export default Cell;
