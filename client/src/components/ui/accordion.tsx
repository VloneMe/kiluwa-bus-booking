import * as React from "react";  
import * as AccordionPrimitive from "@radix-ui/react-accordion";  
import { ChevronDownIcon } from "@radix-ui/react-icons";  
import { cn } from "@/lib/utils";  

// Define the main Accordion component  
const Accordion = AccordionPrimitive.Root;  

// AccordionItem component with forward ref for proper ref forwarding  
const AccordionItem = React.forwardRef<  
  React.ElementRef<typeof AccordionPrimitive.Item>,  
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>  
>(({ className, ...props }, ref) => (  
  <AccordionPrimitive.Item  
    ref={ref}  
    className={cn("border-b", className)} // Apply base styling with optional className  
    {...props}  
  />  
));  
AccordionItem.displayName = "AccordionItem";  

// AccordionTrigger component for the item header with an optional arrow icon  
const AccordionTrigger = React.forwardRef<  
  React.ElementRef<typeof AccordionPrimitive.Trigger>,  
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {  
    hidearrow?: boolean; // Specify that hidearrow is an optional prop  
  }  
>(({ className, children, hidearrow, ...props }, ref) => (  
  <AccordionPrimitive.Header className="flex w-full">  
    <AccordionPrimitive.Trigger  
      ref={ref}  
      className={cn(  
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-180 w-full",  
        className  
      )}  
      {...props}  
    >  
      {children}  
      <ChevronDownIcon className={`size-6 shrink-0 text-muted-foreground transition-transform duration-200 ${hidearrow ? "hidden" : ""}`} />  
    </AccordionPrimitive.Trigger>  
  </AccordionPrimitive.Header>  
));  
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;  

// AccordionContent component for displaying content when the item is active  
const AccordionContent = React.forwardRef<  
  React.ElementRef<typeof AccordionPrimitive.Content>,  
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>  
>(({ className, children, ...props }, ref) => (  
  <AccordionPrimitive.Content  
    ref={ref}  
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"  
    {...props}  
  >  
    <div className={cn("pb-4 pt-0", className)}>{children}</div>  
  </AccordionPrimitive.Content>  
));  
AccordionContent.displayName = AccordionPrimitive.Content.displayName;  

// Export the components for use in the application  
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };