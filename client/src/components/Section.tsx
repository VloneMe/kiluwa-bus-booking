import { ReactNode } from "react";

interface Props {
        children: ReactNode;
        className?: string;
}

export const Section = ({ className, children}: Props ) => {
  return (
    <section className={`lg:min-h-[47.5rem] min-h-fit h-full flex 
                         ${className}`}
    >
        {children}
    </section>
  )
}