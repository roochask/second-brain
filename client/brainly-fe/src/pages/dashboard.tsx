import { useEffect, useState } from 'react'
import '../App.css'
import { Card } from '../components/ui/Card'
import { SideBar } from '../components/ui/SideBar'
import { useContent } from '../hooks/useContent'
import { Header } from '../components/ui/Header'

function DashBoard() {
  const [modelOpen, setModelOpen] = useState(false);
  const {contents, refresh} = useContent();

  useEffect(() => {
    refresh();
  },[modelOpen])

  return (
    <div className='min-h-screen flex w-screen bg-slate-50'>
      <div className='flex overflow-y-scroll bg-white'>
        <div>
          <SideBar />
        </div>
        <div className='ml-72 min-h-screen'>
          <Header modelOpen={modelOpen} setModelOpen={setModelOpen}/>
          <div className='pt-28 p-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {
              contents.map(({type, title, link, _id}) =>
                <Card 
                  type={type} 
                  title={title} 
                  link={link} 
                  contentId={_id}
                />)
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard
