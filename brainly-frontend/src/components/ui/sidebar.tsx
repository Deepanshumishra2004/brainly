import { AllItems } from "../../icons/AllItems";
import { BrainIcon } from "../../icons/BrainIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SideBarItem } from "./SidebarItem";
import { UserButton } from "./ShareButton";

interface SideBarProps{
  filter: string;
  setFilter: (value: string) => void;
  stretchSideBar : boolean;
}

export function SideBar({filter,setFilter,stretchSideBar}:SideBarProps) {

  const items=[
    { text: "All Items", icon: <AllItems /> },
    { text: "Twitter", icon: <TwitterIcon /> },
    { text: "Youtube", icon: <YoutubeIcon /> },
    { text: "Instagram", icon: <YoutubeIcon /> },
    { text: "LinkedIn", icon: <YoutubeIcon /> },
    { text: "Document", icon: <YoutubeIcon /> },
    { text: "Image", icon: <YoutubeIcon /> },
    { text: "Video", icon: <YoutubeIcon /> },
    { text: "Website", icon: <YoutubeIcon /> },
    { text: "Article", icon: <YoutubeIcon /> },
    { text: "Repository", icon: <YoutubeIcon /> },
  ]

  return (
    <div  className={`h-screen bg-white border-r fixed top-0 left-0 z-20  py-2 transition-all duration-300 ease-in-out ${stretchSideBar ? '' : 'w-20'}`}>
      <div className="flex text-2xl pt-4 pl-4 font-semibold items-center pb-4">
        <div className="pr-2 text-purple-600">
          <BrainIcon />
        </div>
        <div className={`
      transition-all duration-300 overflow-hidden
      ${stretchSideBar ? "opacity-100 max-w-[100%]" : "opacity-0 max-w-[0]"}
    `}>
        <span><h1 className="scroll-m-20 text-center text-2xl font-bold tracking-tight text-balance">
      Brainly 
    </h1></span>
        </div>
      </div>
      <div>
      <div className="mx-1.5 border rounded-sm border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-1 overflow-y-auto">
        {items.map((items)=>(
          <SideBarItem
              key={items.text}
              text={items.text}
              icon={items.icon}
              active={filter === items.text}
              onClick={() => setFilter(items.text)}
              stretch={stretchSideBar}
            />
          ))}
      </div>
      {/* <div className="flex ">
        <UserButton/>
      </div> */}
      </div>
    </div>
  );
}
