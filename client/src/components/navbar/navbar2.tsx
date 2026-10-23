import { useEffect, useState } from 'react';  
import { useLocation, Link } from 'react-router-dom';  // React Router imports  
import { MdMenuOpen, MdClose, MdOutlinePassword } from "react-icons/md";  
import { navLinks } from '@/data/navLinks';  // Ensure this path is correct  
import { Container } from '../Container';  // Custom component for layout  
import { RiLogoutCircleLine } from "react-icons/ri";  
import { RiAccountBoxLine } from "react-icons/ri";  
import { FaBusAlt } from 'react-icons/fa';  
import { Separator } from '../ui/separator';  
import { IoIosLogOut, IoMdClose, IoMdPerson } from 'react-icons/io';  
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';  
import { useAuth } from '@/context/AuthProvider';  
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';  
import { ImProfile } from 'react-icons/im';
import { CiLogin } from "react-icons/ci";
import { GiArchiveRegister } from "react-icons/gi";

export const Navbar = () => {  
  const { isLoggedIn, logout, user } = useAuth();  
  const [open, setOpen] = useState(false);   
  const [isVisible, setIsVisible] = useState(false);  
  const location = useLocation();  // React Router's location hook  

  const [route, setRoute] = useState<string | null>(null);  

  const handleScroll = () => {  
    const scrolled = window.scrollY;  
    setIsVisible(scrolled > 80);   
  };  

  useEffect(() => {  
    window.addEventListener("scroll", handleScroll);  
    
    return () => {  
      window.removeEventListener("scroll", handleScroll);  
    };  
  }, []);  
  
  useEffect(() => {  
    setRoute(location.pathname);  
  }, [location]);  

  return (  
    <Container className={`flex items-center mx-auto inset-x-0 z-10 transition-all   
                          ease-in-out duration-500   
                          ${isVisible ? "fixed top-0" : "absolute top-6"}`}  
    >  
      <nav className={`w-full h-[4.5rem] flex flex-col md:flex-row   
                      rounded-lg lg:px-2 relative      
                      gap-1 justify-center  
                      ${!isVisible ? "bg-primary" : "bg-white/90 border-b border-primary"}`}  
      >  

        <Container className='flex items-center justify-between rounded-lg'>  

          <div className='text-white'>  
            <Link to="/" className={`md:text-xl text-lg font-extrabold font-mono   
                                      px-3 py-2 transition duration-300   
                                      hover:text-gray-400 shadow-lg flex  
                                      ${!isVisible ? "text-white" : "text-gray-800"}`}  
            >   
              <p className='font-extrabold'>KILUWA LUXURY COACH</p>  
            </Link>  
          </div>  

          {/* Desktop Navigation Links */}  
          <div className={`hidden lg:flex gap-3 items-center h-full   
                          ${!isVisible ? "text-white" : "text-black"}`}  
          >  
            {navLinks.map((link) => (  
              <Link key={link.linkTo}   
                    to={link.linkTo}   
                    onClick={() => setRoute(link.linkTo)}  
                    className={`hover:text-yellow-600 cursor-pointer rounded-lg py-2 px-5  
                                ${link?.classNames ? "bg-white text-primary font-bold border border-primary" : route === link.linkTo ? "bg-gray-600 text-white" : ""}`}  
              >  
                {link.title}  
              </Link>  
            ))}  

            <div className='text-white gap-2 items-center relative flex'>  
              <div className="hidden">  
                <Select>  
                  <SelectTrigger className={`w-[60px] p-1 border text-sm ${isVisible && "border-gray-800 text-gray-800"}`}>  
                    <SelectValue placeholder="KSW" />  
                  </SelectTrigger>  
                  <SelectContent>  
                    <SelectGroup>  
                      <SelectItem defaultValue={'KSW'} value="Kiswahili">KSW</SelectItem>  
                      <SelectItem value="English">EN</SelectItem>  
                    </SelectGroup>  
                  </SelectContent>  
                </Select>  
              </div>  

              {/* <Popover>   
                <PopoverTrigger className=''>  
                  <MdPerson3 size={30}   
                             className={`p-0.5 border rounded-full   
                              ${isVisible ? "text-gray-800 border-gray-800" : "text-white "}`}  
                />  
              </PopoverTrigger>  
              <PopoverContent className='z-20'>  
                <Link to='/myaccount'   
                      className={`px-6 py-2 bg-main-4   
                              hover:text-yellow-600 hover:bg-main-4/55   
                              rounded-l items-center gap-2   
                              bg-transparent text-gray-700   
                              ${isLoggedIn ? "flex" : "hidden"}`}  
                      onClick={() => setOpen(false)}  
                ><RiAccountBoxLine size={24}/> Akaunti & Profaili</Link>  

                <Separator className=''/>  

                <Link to='/'   
                      className={`px-6 py-2 bg-main-4   
                              hover:text-yellow-600 hover:bg-main-4/55   
                              items-center gap-2 rounded-l bg-transparent   
                              text-gray-700   
                              ${isLoggedIn ? "flex" : "hidden"}`}  
                      onClick={() => logout()}  
                > <RiLogoutCircleLine size={20}/> Toka</Link>  

                <Separator className=''/>  

                <div className={`p-2 hiddden items-center justify-between w-full gap-3  
                                ${!isLoggedIn ? "flex" : "hidden"}`}  
                >  
                  <Link to='login'   
                        className='text-lg text-center rounded-lg   
                                    px-6 py-2 bg-main-4 hover:text-yellow-600   
                                    hover:bg-main-4/55 bg-primary/85   
                                    text-white w-full'  
                        onClick={() => setOpen(false)}  
                  >Ingia</Link>  

                  <Link to='register'   
                        className='text-lg text-center px-6 rounded-lg   
                                    py-2 bg-main-4 hover:text-yellow-600   
                                    hover:bg-main-4/55 bg-primary/85   
                                    text-white w-full'  
                        onClick={() => setOpen(false)}  
                  >Jisajili</Link>   
                </div>   
              </PopoverContent>  
            </Popover>   */}
          </div>  
          </div>  

          <div className='flex items-center gap-2'>
            {/* Mobile Menu Button */}  
            <div className={`lg:hidden flex cursor-pointer p-1 rounded-lg   
                              ${isVisible && "bg-primary"}`}>
              {open ? (  
                <MdClose size={38} onClick={() => setOpen(!open)}className='text-gray-300' />  
              ) : (  
                <MdMenuOpen size={30} onClick={() => setOpen(!open)} className='text-gray-300' />  
              )}  
            </div>  

            <Popover>  
              <PopoverTrigger>  
                  <span className={`h-10 w-10 border-2 rounded-full   
                                  flex items-center justify-center   
                                  border-secondary font-bold   
                                  hover:text-white hover:bg-primary 
                                  ${isVisible ? "" : "text-white"}`}  
                  >  
                      {!user ? (<IoMdPerson  size={23}/>) :  user?.first_name[0]}  
                  </span>  
              </PopoverTrigger>  

              <PopoverContent className='py-5 flex flex-col space-y-2'>  
                  {user ? (
                    <div>
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
                            <IoIosLogOut /> Toka  {/* Logout */}  
                        </Link>
                    </div>
                  ) : (
                    <div className='flex flex-col space-y-3'>
                      <Link to="/login"
                            className='flex items-center gap-3 w-full'
                      >
                        <CiLogin /> <span>Ingia</span>
                      </Link>

                      <Separator />

                      <Link to="/register"
                            className='flex items-center gap-3 w-full'
                      >
                      <GiArchiveRegister /> <span>Jisajili</span>
                      </Link>
                    </div>
                  )}  
              </PopoverContent>  
            </Popover>
          </div>
        </Container>  
      </nav> 

      {/* Mobile Navigation Links */}  
      {open && (  
        <div className='fixed z-20 inset-0  w-full   
                        bg-main-3 p- md:hidden bg-gray-300   
                        h-screen flex flex-col justify-between gap-5'  
        >  

          <div >  
            <Container className='flex h-[5rem] items-center justify-between'>  
                <div className='text-white md:hidden shadow-lg py-2'>  
                    <Link to="/" className={`md:text-xl h-full text-lg font-extrabold   
                                              font-mono   
                                              px-3 transition duration-300   
                                              hover:text-gray-400 flex items-center  
                                              gap-2 shadow-sm text-gray-800 shadow-gray-800}`}  
                    >  
                      <FaBusAlt className="text-center"/>  
                      <p className='font-extrabold'>KILUWA LUXURY COACH</p>  
                    </Link>  
                </div>  
                <span onClick={() => setOpen(!open)}   
                      className='text-3xl rounded-lg p-1 font-bold bg-red-800 text-white'  
                >  
                  <IoMdClose />  
                </span>  
            </Container>  
            <Container className='flex flex-col gap-4 text-gray-700'>  
              {navLinks.map((link) => (  
                <Link key={link.linkTo}   
                      to={link.linkTo}   
                      onClick={() => setOpen(false)}   
                      className={`hover:text-yellow-600 px-4 py-2 rounded-lg  
                                  ${route === link.linkTo ? "bg-gray-600  text-yellow-600" : ""}  
                                  ${link.title == "Contact us" && "hidden"}`}  
                >  
                  {link.title}  
                </Link>  
              ))}  

              <Separator className=''/>  

              <Link to='contactus'   
                    className='text-lg px-6 py-2 bg-main-4 hover:text-yellow-600 hover:bg-main-4/55 border border-primary rounded-l bg-transparent text-gray-700'  
                    onClick={() => setOpen(false)}  
              >Wasiliana Nasi</Link>   

              <Separator className='bg-gray-800'/>  

              <Link to='/myaccount'   
                    className={`px-6 py-2 bg-main-4 hover:text-yellow-600 hover:bg-main-4/55 rounded-l items-center gap-2 bg-transparent text-gray-700 ${isLoggedIn ? "flex" : "hidden"}`}  
                    onClick={() => setOpen(false)}  
              ><RiAccountBoxLine size={24}/> Akaunti & Profaili</Link>  

              <Separator className=''/>  

              <Link to='/'   
                    className={`px-6 py-2 bg-main-4 hover:text-yellow-600 hover:bg-main-4/55 items-center gap-2 rounded-l bg-transparent text-gray-700 ${isLoggedIn ? "flex" : "hidden"}`}  
                    onClick={() => {setOpen(false); logout()}}  
              > <RiLogoutCircleLine size={20}/> Toka</Link>  

              <Separator className=''/>  

              <div className={`p-2 hiddden items-center justify-between w-full gap-3 ${isLoggedIn ? "hidden": "flex"}`}>  
                <Link to='login'   
                      className='text-lg text-center rounded-lg px-6 py-2 bg-main-4 hover:text-yellow-600 hover:bg-main-4/55 bg-primary/85 text-white w-full'  
                      onClick={() => setOpen(false)}  
                >Ingia</Link>  

                <Link to='register'   
                      className='text-lg text-center px-6 rounded-lg py-2 bg-main-4 hover:text-yellow-600 hover:bg-main-4/55 bg-primary/85 text-white w-full'  
                      onClick={() => setOpen(false)}  
                >Jisajili</Link>   
              </div>   
            </Container>   
          </div>   

          <div className="w-full text-sm py-2 flex text-gray-700   
                          items-center justify-center tracking-wider   
                          font-mono rounded-t-2xl border-t-2   
                          border-yellow-700 bg-white"  
          >  
                  <p>© {new Date().getFullYear()} BusPoa. Haki Zote Zimehifadhiwa.</p>  
          </div>   
        </div>  
      )}  
    </Container>  
  );  
};