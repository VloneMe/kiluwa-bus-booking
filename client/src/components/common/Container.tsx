import { ReactNode } from "react"


interface Props {
    children: ReactNode;
    className?: string;
    id?: string
}


export const Container = (
    { children, className, id }: Props
) => {
  return (
    <div id={id} className={`max-w-[90rem] container mx-auto md:px-3 px-3 ${className}`}
    >
        {children}
    </div>
  )
}
