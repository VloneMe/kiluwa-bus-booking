import {  
        Popover,  
        PopoverContent,  
        PopoverTrigger,  
    } from "@/components/ui/popover";  
    import { Link } from 'react-router-dom';  
    import { Separator } from '../ui/separator';  
    import { useAuth } from '@/context/AuthProvider';  
    import { IoIosLogOut } from 'react-icons/io';  
    import { ImProfile } from 'react-icons/im';  
    import { MdOutlinePassword } from 'react-icons/md';  
    import { Container } from "../Container";  
import { FaTicket } from "react-icons/fa6";
    
    export const AccessNavbar = () => {  
        const { user, logout } = useAuth();  
        return (  
            <nav className='w-full h-[4rem] flex items-center   
                            justify-between border-b-2   
                            border-secondary bg-white'  
            >  
                <Container className='flex items-center justify-between'>  
                    <Link to={'/'} className='text-lg font-bold uppercase'>  
                        Kiluwa Luxuary Coach  
                    </Link>  
    
                    <Popover>  
                        <PopoverTrigger>  
                            <span className='h-10 w-10 border-2 rounded-full   
                                            flex items-center justify-center   
                                            border-secondary font-bold   
                                            hover:text-white hover:bg-primary'  
                            >  
                                {user?.first_name[0]}  
                            </span>  
                        </PopoverTrigger>  
    
                        <PopoverContent className='py-5 flex flex-col space-y-2'>

                            <Link to={"/"} className='flex items-center gap-3 hover:text-secondary'>  
                                <FaTicket />  Kata Tiketi  
                            </Link>  
    
                            <Separator className='mb-2'/> 

                            <Link to={"/myaccount"} className='flex items-center gap-3 hover:text-secondary'>  
                                <ImProfile /> Wasifu Wangu  {/* My Profile */}  
                            </Link>  
    
                            <Separator className='mb-2'/>  
    
                            <Link to={"/myaccount/change-password"} className='flex items-center gap-3 hover:text-secondary'>  
                                <MdOutlinePassword /> Badilisha Nenosiri  {/* Change Password */}  
                            </Link>  
    
                            <Separator className='mb-2'/>  
    
                            <Link to={"/myaccount/update-profile"}   
                                  className='flex items-center gap-3 hover:text-secondary'>  
                                <ImProfile /> Badilisha Wasifu  {/* Update Profile */}  
                            </Link>  
    
                            <Separator className='mb-2 bg-primary'/>  
                            
                            <Link to={"/"} onClick={() => logout()}  
                                  className='flex items-center gap-3 hover:text-secondary'>  
                                <IoIosLogOut size={19} /> Toka  {/* Logout */}  
                            </Link>  
                        </PopoverContent>  
                    </Popover>  
                </Container>  
            </nav>  
        );  
    }