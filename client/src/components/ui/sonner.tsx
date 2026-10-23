import type React from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "bus-toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          title: "bus-toast__title",
          description: "bus-toast__desc",
          actionButton:
            "bus-toast__action",
          cancelButton:
            "bus-toast__cancel",
        },
      }}
      {...props}
    />
  );
}

