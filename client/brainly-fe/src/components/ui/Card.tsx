import { BACKEND_URL } from "../../config";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { NoteBookIcon } from "../../icons/NotebookIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import axios from "axios";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";

interface CardProps {
    title: string;
    link: string;
    type: "twitter" | "youtube";
    contentId: string;
}

export function Card({title, link, type, contentId}: CardProps) {

    async function deleteContent() {
        await axios.delete(`${BACKEND_URL}/api/v1/content?contentId=${contentId}`,{
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
    }

    return(
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden h-80 flex flex-col">
            {/* Card title */}
            <div className="p-3 border-b border-gray-100">
                <div className="flex justify-between items-center text-gray-600 text-sm">
                    <div className="flex items-center truncate">
                        <div className="mr-2 flex-shrink-0">
                            {type === "youtube" && <YoutubeIcon />}
                            {type === "twitter" && <TwitterIcon />}
                        </div>
                        <span className="truncate">{title}</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <a href={link} target="_blank" className="hover:text-blue-600">
                            <ShareIcon />
                        </a>
                        <button onClick={deleteContent} className="hover:text-red-600">
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
            </div>

            {/* Card content */}
            <div className="flex-1 p-3 overflow-hidden cursor-pointer">
                {type === "youtube" && (
                    <div className="w-full h-full">
                        <iframe 
                            src={link.replace("watch", "embed").replace("?v=","/")} 
                            className="w-full h-full rounded border-0"
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                )}
                {type === "twitter" && (
                    <div className="h-full overflow-hidden">
                        <blockquote className="twitter-tweet" data-theme="light" data-width="100%">
                            <a href={link.replace("x.com","twitter.com")}></a>
                        </blockquote>
                        <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
                    </div>
                )}
            </div>

        </div>
    )
}