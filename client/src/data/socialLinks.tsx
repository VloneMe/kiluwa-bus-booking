import { FaGithub, FaTwitter, FaInstagram, FaLinkedinIn} from 'react-icons/fa';
import { FaSquareUpwork, FaXTwitter } from "react-icons/fa6";


export const socialLinks = [  
    { 
        href: 'https://github.com/VloneMe', 
        icon: <FaGithub className="text-2xl hover:text-black" />, 
        label: 'GitHub' },  
    { 
        href: 'https://x.com/FrancisNti93305', 
        icon: <FaXTwitter className="text-2xl hover:text-black" />, 
        label: 'Twitter' },  
    { 
        href: 'https://www.instagram.com/francisntima.tech/', 
        icon: <FaInstagram className="text-2xl hover:text-red-700"/>, 
        label: 'Instagram' },  
    { 
        href: 'https://www.linkedin.com/in/francis-ntima-521038270/', 
        icon: <FaLinkedinIn className="text-2xl hover:text-blue-700"/>, 
        label: 'LinkedIn' },  
    { 
        href: 'https://www.upwork.com/freelancers/~01d02f33e88890c8d1', 
        icon: <FaSquareUpwork className="text-2xl hover:text-green-700" />, 
        label: 'Upwork' },  
  ];