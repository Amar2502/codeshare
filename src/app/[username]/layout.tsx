import SideBar from "./sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
          <div className='flex h-screen'>
            <div className='w-64 bg-gray-800 text-white h-full'>
              <SideBar />
            </div>
            <div className='flex-1 overflow-auto'>
            <main className="flex-1">{children}</main>
            </div>
          </div>
        </>
      )
  }
  