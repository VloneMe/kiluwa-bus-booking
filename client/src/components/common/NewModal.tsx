import { ReactNode, useEffect } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  children: ReactNode;
  open: boolean;
  setOpen?: () => void;
  className?: string;
}

export const NewModal = ({ children, open, setOpen, className }: Props) => {
  
  useEffect(() => {
    if (open) {
      // Disable background scrolling when the modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Enable background scrolling when the modal is closed
      document.body.style.overflow = "auto";
    }

    // Cleanup when the modal is unmounted or when 'open' changes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "wrapper") {
      // Check if setOpen is defined before calling it
      if (setOpen) {
        setOpen(); // Close the modal if clicked outside the content
      }
    }
  };

  return (
    <div
      id="wrapper"
      onClick={handleClose}
      className="fixed inset-0 z-20 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center w-full h-full transition-all duration-300"
    >
      <div className="h-fit w-full flex p-3 relative">
        <ScrollArea className={`h-screen mx-auto xl:w-9/12 w-full rounded-md border md:p-4 p- ${className}`}>
          <Button
            onClick={setOpen}
            className="text-white font-bold text-xl place-self-end bg-red-500 hover:bg-red-700 absolute right-6 top-8 border"
          >
            X
          </Button>
          
          <div className="w-full bg-white h-full p-3 py-5 rounded-lg flex justify-center overflow-y-scroll">
            {children}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
