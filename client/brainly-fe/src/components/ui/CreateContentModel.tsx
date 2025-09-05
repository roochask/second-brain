import { useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon"
import { Button } from "./Button"
import { Input } from "./Input"
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { DocumentIcon } from "../../icons/DocumentIcon";
import { LinkIcon } from "../../icons/LinkIcon";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter",
    Document = "document",
    Link = "link"
}

export const CreateContentModel = ({open, onClose}: {open: boolean; onClose: () => void}) => {
    const [type, setType] = useState(ContentType.Youtube);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");

    const contentTypes = [
        { value: ContentType.Youtube, label: "YouTube", icon: <YoutubeIcon /> },
        { value: ContentType.Twitter, label: "Twitter", icon: <TwitterIcon /> },
        { value: ContentType.Document, label: "Document", icon: <DocumentIcon /> },
        { value: ContentType.Link, label: "Link", icon: <LinkIcon /> }
    ];

    const selectedType = contentTypes.find(ct => ct.value === type);

    async function addContent() {
        try {
            await axios.post(`${BACKEND_URL}/api/v1/content`, {
                link: link.trim(),
                type, 
                title: title.trim()
            },{
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            // Reset form
            setTitle("");
            setLink("");
            onClose();
        } catch (error) {
            console.error("Failed to add content:", error);
        }    
    }


    return(
        <div>
            {open && (
                <>
                    {/* Overlay */}
                    <div className="h-screen w-screen bg-black fixed top-0 left-0 opacity-50 z-40">                        
                    </div>
                    {/* Modal */}
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 w-96 mx-4">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Add Content</h2>
                                <button 
                                    onClick={onClose} 
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                >
                                    <CrossIcon />
                                </button>
                            </div>
                            {/* Form Fields */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-semibold text-gray-700 w-16 flex-shrink-0">Title:</label>
                                    <div className="flex-1">
                                        <Input 
                                            placeholder="Enter content title" 
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-semibold text-gray-700 w-16 flex-shrink-0">URL:</label>
                                    <div className="flex-1">
                                        <Input 
                                            placeholder="Enter content URL" 
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Content Type Dropdown */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Content Type</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="mr-3 w-4 h-4 flex items-center justify-center">{selectedType?.icon}</div>
                                                <span className="text-gray-900">{selectedType?.label}</span>
                                            </div>
                                            <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>
                                    
                                    {isDropdownOpen && (
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {contentTypes.map((contentType) => (
                                                <button
                                                    key={contentType.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setType(contentType.value);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center first:rounded-t-lg last:rounded-b-lg transition-colors ${
                                                        type === contentType.value ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                                    }`}
                                                >
                                                    <div className="mr-3 w-4 h-4 flex items-center justify-center">{contentType.icon}</div>
                                                    <span>{contentType.label}</span>
                                                    {type === contentType.value && (
                                                        <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex justify-center gap-3 pt-2">
                                <Button 
                                    variant="secondary" 
                                    text="Cancel" 
                                    onClick={onClose}
                                />
                                <Button 
                                    variant="primary" 
                                    text="Add Content" 
                                    loading={!title || !link}
                                    onClick={addContent}
                                />
                            </div>
                        </div> 
                    </div>
                </>
            )}

        </div>
    )
}