import { ReactElement } from "react";

export function SideBarItem({text,icon,onClick}: {text: string; icon: ReactElement, onClick?:() => void}) {
    return(
        <div className="flex text-gray-900 p-2 cursor-pointer
        hover:bg-blue-50 hover:text-blue-900 font-semibold text-md rounded-lg pl-4
        duration-150 ease-in-out space-x-4 items-center justify-start w-full "
            onClick={onClick}
        >
            <div className="">
                {icon}
            </div>
            <div>
                {text}
            </div>
        </div>
    )
} 