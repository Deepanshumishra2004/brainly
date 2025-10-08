import { use, useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { CardInfo } from "../components/ui/CardInfo";
import { CreateContentModal } from "../components/ui/CreateContentModel";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { useContent } from "../components/ui/hooks/useContent";
import { BACKEND_URL } from "../Config";
import { SideBar } from "../components/ui/sidebar";
import axios from "axios";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const { contents, refresh } = useContent();
  const [link, setLink] = useState("");
  const [filter, setFilter] = useState("All Items");
  const [stretchSideBar, setStretchSideBar] = useState(false);

  useEffect(() => {
    if (!modalOpen) refresh();
  }, [modalOpen]);


  const token = localStorage.getItem("token");
  console.log(token);
  const username = token ? JSON.parse(atob(token.split('.')[1])).username : "";
  console.log(username)


  const shareBrain = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        { share: true },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );
      const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
      setLink(shareUrl);
    } catch (error) {
      console.error("Failed to share brain:", error);
      alert("Error while sharing. Try again.");
    }
  };


  const regenerateLink = async () => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/brain/share`,
      { share: true, regenerate: true },
      {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      }
    );
    const newLink = `http://localhost:5173/share/${response.data.hash}`;

    console.log("link :: ",newLink)
    setLink(newLink);
  } catch (error) {
    console.error("Failed to regenerate brain link:", error);
    alert("Error while regenerating. Try again.");
  }
};


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
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        <div className="flex justify-between items-center pr-6 pl-8">
          <Button onClick={() => setStretchSideBar(!stretchSideBar)}>
            {stretchSideBar ? "Shrink" : "Expand"}
          </Button>

          <div className="flex justify-end gap-4 ">
            <Button onClick={() => setModalOpen(true)} variant="default">
              <PlusIcon /> Add content
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={shareBrain} variant="secondary">
                  <ShareIcon /> Share brain
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share link</DialogTitle>
                  <DialogDescription>
                    Anyone who has this link will be able to view your Brain.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                    <Input id="link" defaultValue={link} readOnly />
                  </div>
                </div>
                <DialogFooter className="sm:justify-between flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={regenerateLink}>
                    🔁 Regenerate link
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
          <div className="pl-8 pr-4">
          <div className="mt-4 my-4">
            <h2 className="scroll-m-20 border-b pb-2 text-xl text-gray-500  font-semibold tracking-tight first:mt-0 flex gap-2">
              Username : <p className="text-blue-600 font-semibold first-letter:uppercase"> {username}</p>
            </h2>
          </div>
            <div className="rounded-2xl bg-white shadow-xl border p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {(contents as Array<{ type: string; link: string; title: string; _id: string}>)
                  .filter((e) => {
                    if (filter === "All Items") return true;
                    return (
                      (e.type || "").trim().toLowerCase() === filter.trim().toLowerCase()
                    );
                  })
                  .map(({ type, link, title, _id }) => (
                    <CardInfo key={_id} type={type} link={link} title={title}   contentId={_id} onDelete={refresh}/>
                  ))}
                </div>
              </div>
          </div>
      </div>
    </div>
  );
}
