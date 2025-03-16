import { ReactElement } from "react";

interface ButtonProps{
    text:string;
    size:"sm"|"md"|"lg"
    startIcon?:ReactElement;
    endIcon?:ReactElement;
    variant:"primary"|"secondary";
}

const sizeStyle={
    "lg":"px-8 py-4 ",
    "md":"px-4 py-2 ",
    "sm":"px-2 py-1 "
}

const colorStyle={
    "primary":"bg-purple-600 text-white",
    "secondary":"bg-purple-300 text-purple-600"
}

export function Button(props:ButtonProps){

    return <button className={`${sizeStyle[props.size]} ${colorStyle[props.variant]}`}>
        <div className="flex items-center">
        {props.startIcon}
        <div className="pl-2 pr-2">
            {props.text}
        </div>
        {props.endIcon}
        </div>
    </button>
}