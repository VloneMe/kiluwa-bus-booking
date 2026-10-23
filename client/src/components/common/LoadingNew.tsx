import React from 'react'; 

interface props {
        className?: string
}

export const LoadingNew: React.FC = ({ className }: props) => {  
  return (  
    <div className={`flex flex-col gap-3 w-full justify-center text-centeritems-center${className}`}>  
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-900"></div>   
      <span>Subiri Kidogo ....</span>  
    </div>  
  );  
};