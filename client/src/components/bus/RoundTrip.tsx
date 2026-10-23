import { SetStateAction, useState } from "react";  

export const RoundTrip = () => {  
    const [active, setActive] = useState("oneWay"); // State to track the active option  

    const handleToggle = (option: SetStateAction<string>) => {  
        setActive(option); // Update the active state based on the clicked option  
    };  

    return (  
        <div className="grid grid-cols-2 w-full gap-1 border   
                        border-gray-600 h-12 rounded-lg   
                        items-center font-bold p-1 transition-all duration-300 ease-in"  
        >  
            <span   
                onClick={() => handleToggle("oneWay")} // Handle click for One Way  
                className={`w-full h-full flex items-center   
                            justify-center text-white   
                            rounded-lg ${active === "oneWay" ? "bg-primary" : "bg-gray-400"}`}  
            >  
                One Way  
            </span>  
            <span   
                onClick={() => handleToggle("twoWay")} // Handle click for Two Way  
                className={`w-full h-full flex items-center   
                            justify-center text-white   
                            rounded-lg ${active === "twoWay" ? "bg-primary" : "bg-gray-400"}`}  
            >  
                Two Way  
            </span>  
        </div>  
    );  
}