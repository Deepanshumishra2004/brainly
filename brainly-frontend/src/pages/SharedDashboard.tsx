import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardInfo } from "../components/ui/CardInfo";
import { BACKEND_URL } from "../Config";
import { SideBar } from "../components/ui/sidebar";
import { Button } from "../components/ui/Button";
import { ShareCardInfo } from "@/components/ui/ShareCardInfo";

interface ContentType {
  _id: string;
  title: string;
  link: string;
  type: string;
}

export function SharePage() {
  const { hash } = useParams();
  const [contents, setContents] = useState<ContentType[]>([]);
  const [username, setUsername] = useState("");
  const [filter, setFilter] = useState("All Items");
  const [stretchSideBar, setStretchSideBar] = useState(false);

  useEffect(() => {
    async function fetchSharedContent() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/brain/${hash}`);
        if (!res.ok) throw new Error("Failed to load shared brain");
        const data = await res.json();
        setContents(data.content);
        setUsername(data.username);
      } catch (err) {
        console.error(err);
        alert("Invalid or expired share link.");
      }
    }

    fetchSharedContent();
  }, [hash]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`transition-all duration-300 ease-in-out 
        ${stretchSideBar ? "w-40" : "w-16"} 
        hidden sm:block border-r bg-white`}
      >
        <SideBar
          filter={filter}
          setFilter={setFilter}
          stretchSideBar={stretchSideBar}
        />
      </div>

      <div className="flex-1 flex flex-col min-h-screen bg-gray-100 p-4 overflow-auto">
        <div className="flex justify-between items-center pr-6 pl-8">
          <Button onClick={() => setStretchSideBar(!stretchSideBar)}>
            {stretchSideBar ? "Shrink" : "Expand"}
          </Button>
        </div>

        <div className="pl-8 pr-4">
          <div className="mt-4 my-4">
            <h2 className="scroll-m-20 border-b pb-2 text-xl text-gray-500 font-semibold tracking-tight first:mt-0 flex gap-2">
              Shared content of username :  <p className="text-blue-600 font-semibold first-letter:uppercase"> {username}</p>
            </h2>
          </div>

          <div className="rounded-2xl bg-white shadow-xl border p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {contents
                .filter((e) => {
                  if (filter === "All Items") return true;
                  return (
                    (e.type || "").trim().toLowerCase() ===
                    filter.trim().toLowerCase()
                  );
                })
                .map(({ type, link, title, _id }) => (
                  <ShareCardInfo
                    key={_id}
                    type={type}
                    link={link}
                    title={title}
                    contentId={_id}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
