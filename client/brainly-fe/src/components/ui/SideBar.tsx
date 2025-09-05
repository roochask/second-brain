import { BACKEND_URL } from "../../config";
import { DocumentIcon } from "../../icons/DocumentIcon";
import { LinkIcon } from "../../icons/LinkIcon";
import { Logo } from "../../icons/Logo";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SideBarItem } from "./SideBarItem";
import axios from "axios";

export function SideBar() {

    async function filteredData() {
        const response = await axios.get(`${BACKEND_URL}/api/v1/content`,{
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })

        if(!response.data) {
            
            return;
        }

        const data = (response.data as any)?.content;

        const filteredContent = data.filter((x: any) => x.type === "youtube")
        console.log((response.data as any)?.content)
    }

    return(
        <div className="h-screen p-6 border-r border-gray-200 w-72 fixed left-0 top-0 bg-white shadow-md space-y-4 z-5">
            <div className="flex text-2xl items-center w-full">
                <div className="pr-2 ">
                    <Logo />
                </div>
                Brainly
            </div>
           <div className="pt-8 space-y-4 w-full">
                <SideBarItem icon={<TwitterIcon />} text="Tweets" onClick={filteredData}/>
                <SideBarItem icon={<YoutubeIcon />} text="Videos"/>
                <SideBarItem icon={<DocumentIcon />} text="Documents"/>
                <SideBarItem icon={<LinkIcon />} text="Links"/>
           </div>
        </div>
    )
}