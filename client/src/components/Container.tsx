import { ReactNode } from "react"


interface Props {
    children: ReactNode;
    className?: string;
    id?: string;
    /** Use full viewport width (no `container` max-width cap). */
    fullWidth?: boolean;
}


export const Container = (
    { children, className, id, fullWidth }: Props
) => {
  return (
    <div
      id={id}
      className={`mx-auto px-3 md:px-3 ${fullWidth ? "w-full max-w-none" : "container max-w-[90rem]"} ${className ?? ""}`}
    >
        {children}
    </div>
  )
}
