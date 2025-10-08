import { useRef, useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import axios from "axios";
import { BACKEND_URL } from "../../Config";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // 👈 import the Card components


export enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
  Instagram = "instagram",
  LinkedIn = "Linkedin",
  Image = "image",
  Video = "video",
  Document = "document",
  Website = "website",
  Repository = "repository",
  Article = "article",
}


interface CreateContentModelProps {
    open: boolean;
    onClose: () => void;
}

export function CreateContentModal({ open, onClose }: CreateContentModelProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState(ContentType.Youtube);
    const [loading, setLoading] = useState(false);

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;

        if (!title || !link) {
            alert("Please enter both title and link");
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                `${BACKEND_URL}/api/v1/content`,
                { link, title, type },
                {
                    headers: {
                        Authorization: localStorage.getItem("token") || "",
                    },
                }
            );
            onClose();
        } catch (error) {
            alert("Failed to add content. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (!open) return null;

    return (
  <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
    <Card className="z-10 w-full max-w-md">
      <CardHeader className="flex justify-end">
        <button onClick={onClose}>
          <CrossIcon />
        </button>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input ref={titleRef} placeholder="Title" />
        <Input ref={linkRef} placeholder="Link" />

        <div>
          <h1 className="text-sm font-semibold mb-2">Type</h1>
          <div className="flex flex-wrap gap-2 justify-center m-2">
            <Button
              text="Youtube"
              variant={type === ContentType.Youtube ? "default" : "secondary"}
              onClick={() => setType(ContentType.Youtube)}
            />
            <Button
              text="Twitter"
              variant={type === ContentType.Twitter ? "default" : "secondary"}
              onClick={() => setType(ContentType.Twitter)}
            />
            <Button
              text="Instagram"
              variant={type === ContentType.Instagram ? "default" : "secondary"}
              onClick={() => setType(ContentType.Instagram)}
            />
            <Button
              text="LinkedIn"
              variant={type === ContentType.LinkedIn ? "default" : "secondary"}
              onClick={() => setType(ContentType.LinkedIn)}
            />
            <Button
              text="Document"
              variant={type === ContentType.Document ? "default" : "secondary"}
              onClick={() => setType(ContentType.Document)}
            />
            <Button
              text="Image"
              variant={type === ContentType.Image ? "default" : "secondary"}
              onClick={() => setType(ContentType.Image)}
            />
            <Button
              text="Video"
              variant={type === ContentType.Video ? "default" : "secondary"}
              onClick={() => setType(ContentType.Video)}
            />
            <Button
              text="Website"
              variant={type === ContentType.Website ? "default" : "secondary"}
              onClick={() => setType(ContentType.Website)}
            />
            <Button
              text="Article"
              variant={type === ContentType.Article ? "default" : "secondary"}
              onClick={() => setType(ContentType.Article)}
            />
            <Button
              text="Repository"
              variant={type === ContentType.Repository ? "default" : "secondary"}
              onClick={() => setType(ContentType.Repository)}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 flex justify-center">
        <Button
          onClick={addContent}
          variant="default"
          size="lg"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  </div>
);

}
