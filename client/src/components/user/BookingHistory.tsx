import { ReactNode } from "react";

interface Props {
        idx: number;
        Route: string;
        date: string;
        children: ReactNode;
}

export const BookingHistory = ({ children, Route, date, idx }: Props) => {
  return (
        <div className="collapse collapse-plus bg-base-200">

                <input  type="radio" 
                        name={`my-accordion-${idx}`} 
                        // defaultChecked 
                />

                <div className="collapse-title text-xl font-medium flex items-center justify-between"
                >
                        <p>{Route}</p> <p>{date}</p>  
                </div>

                <div className="collapse-content">
                        {children}
                </div>
        </div>
  )
}
