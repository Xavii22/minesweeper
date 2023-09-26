import React, { Component } from "react";

const Flag = (props) => {
    return (
        <div className="flag">
            <span>Flags: {props.counter}</span>
        </div>
    );
};

export default Flag;
