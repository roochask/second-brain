import { ReactElement } from "react";

interface ButtonProps {
    text: string;
    startIcon?: ReactElement;
    variant: "primary" | "secondary";
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
}

const  buttonVariants = {
    "primary": "bg-indigo-600 text-white text-md hover:bg-indigo-700 transition-colors duration-200",
    "secondary": "bg-slate-100 text-md text-indigo-600 hover:bg-slate-200 hover:text-indigo-700 transition-all duration-200"
}

const defaultStyles = "px-4 py-2 text-md rounded-md font-light flex items-center cursor-pointer";

export const Button = ({variant, text, startIcon, onClick, fullWidth, loading}: ButtonProps) => {
    return (
        <button 
            className={`${defaultStyles} ${buttonVariants[variant]} ${fullWidth ? "w-full flex justify-center flex-1" : ""} 
            ${loading ? "opacity-45": ""}`}
            disabled={loading}
            onClick={onClick}
        >
            {startIcon}
            <div className="pl-2 pr-2">{text}</div>
        </button>
    )    
}