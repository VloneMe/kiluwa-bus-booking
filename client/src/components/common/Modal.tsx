import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { cn } from "@/lib/utils";

interface Props {  
  children: ReactNode;  
  className?: string;  
  open: boolean;  
  onOpenChange: Dispatch<SetStateAction<boolean>>;  
}  

export function Modal(  
  { children, className, open, onOpenChange }: Props  
) {  
  return (  
    <Dialog open={open} onOpenChange={onOpenChange}>  
      <DialogContent
        className={cn(
          "mx-auto m-0 max-h-[95vh] max-w-full w-[min(100%,90vw)] min-h-0 overflow-y-auto overflow-x-hidden rounded-lg p-0",
          className,
          "overflow-y-auto overflow-x-hidden min-h-0",
        )}
      >
        {children}  
      </DialogContent>  
    </Dialog>  
  );  
}