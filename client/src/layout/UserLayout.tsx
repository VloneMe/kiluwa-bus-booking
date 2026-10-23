import { AccessNavbar } from "@/components/user/AccessNavbar";
import { Outlet } from "react-router-dom";
import logo from "/logo.png?url";


export const UserLayout = () => {
  return (
    <div>
      <AccessNavbar />
      <main>
          <Outlet />
      </main>
        <div className="w-full text-sm py-2 flex text-gray-700 
                        items-center justify-center tracking-wider 
                        font-mono rounded-t-2xl border-t-2 
                        border-yellow-700 bg-primary flex-col space-y-5"
        >
                <p className="text-gray-300 pt-5"
                >© {new Date().getFullYear()} BusPoa. All Rights Reserved.</p>

                <div>
                  <img src={logo} className="size-40 rounded-xl md:hidden"/>
                </div>
        </div>
    </div>
  )
}
