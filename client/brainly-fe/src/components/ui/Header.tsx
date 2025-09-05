import { PlusIcon } from "../../icons/PlusIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { Button } from "./Button";
import { CreateContentModel } from "./CreateContentModel";

export function Header({modelOpen, setModelOpen}: {
    modelOpen: boolean;
    setModelOpen: (open: boolean) => void;
}) {

    return(
        <div className="bg-white fixed top-0 left-72 right-0 z-10 p-4 border-b border-gray-200 shadow-sm">
            <CreateContentModel open={modelOpen} onClose={() => setModelOpen(false)}/>
             <div className='flex justify-between items-center'>
              <div className='text-2xl font-mono flex justify-start pl-2'>
                  All Notes
              </div>
              <div className='flex justify-end gap-4'>
                  <Button variant="secondary" startIcon={<ShareIcon />} text='Share Brain'/>
                  <Button 
                      variant="primary" 
                      startIcon={<PlusIcon />} 
                      text='Add Content'
                      onClick={() => setModelOpen(true)}
                  />
              </div>
            </div>
        </div>
    )
}