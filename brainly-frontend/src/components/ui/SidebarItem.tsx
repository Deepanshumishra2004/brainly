import { ReactElement } from "react";

interface SideBarItemProps {
  text: string;
  icon: ReactElement;
  active: boolean;
  onClick: () => void;
  stretch?: boolean;
}

export function SideBarItem({ text, icon, active, onClick, stretch = true }: SideBarItemProps) {
  return (
    <div>

    <div className="border rounded-sm my-1 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
    <div
      onClick={onClick}
      className={`
        flex items-center px-4  cursor-pointer max-w-60 transition-all duration-300
        ${active ? "bg-accent text-accent-foreground" : "text-gray-700 hover:bg-accent hover:text-accent-foreground"}
        py-1.5
      `}
    >

      <div className="w-6 h-8 text-xl text-primary flex items-center justify-center">
        {icon}
      </div>

      <div
        className={`
          font-medium transition-all duration-300 overflow-hidden whitespace-nowrap text-sm
          ${stretch ? "opacity-100 ml-3 max-w-[160px]" : "opacity-0 ml-0 max-w-0"}
        `}
      >
        {text}
      </div>
    </div>
    </div>
    </div>
  );
}
