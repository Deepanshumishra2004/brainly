// CardInfo.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "./Button";
import { useEffect, useState } from "react";

interface CardInfoProps {
  title: string;
  link: string;
  type: string;
  contentId :string;
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
      if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/embed/")[1];
      if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/shorts/")[1];
    }
    return null;
  } catch {
    return null;
  }
}

const typeMap: Record<string, string> = {
  twitter: "Twitter",
  youtube: "YouTube",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  document: "Document",
  image: "Image",
  video: "Video",
  article: "Article",
  website: "Website",
  repository: "Repository",
};

function useMicrolinkPreview(url: string) {
  const [preview, setPreview] = useState<any>(null);
  useEffect(() => {
    async function fetchPreview() {
      try {
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
        const json = await res.json();
        if (json.status === "success") {
          setPreview(json.data);
        }
      } catch (err) {
        console.error("Microlink fetch failed", err);
      }
    }
    fetchPreview();
  }, [url]);

  return preview;
}

export function ShareCardInfo({ title, link, type }: CardInfoProps) {
  const normalizedType = typeMap[type.trim().toLowerCase()] || type;
  const microlinkPreview = useMicrolinkPreview(link);



  useEffect(() => {
    if (normalizedType === "Instagram") {
      const scriptId = "instagram-embed-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
          (window as any).instgrm?.Embeds?.process?.();
        };
      } else {
        setTimeout(() => {
          (window as any).instgrm?.Embeds?.process?.();
        }, 100);
      }
    }
  }, [normalizedType, link]);

  let content: React.ReactNode = null;

  if (normalizedType === "YouTube") {
    const videoId = extractYouTubeId(link);
    content = videoId ? (
      <iframe
  width="100%"
  height="315"
  src={`https://www.youtube.com/embed/${videoId}`}
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>
    ) : (
      <div className="text-red-500">Invalid YouTube link</div>
    );
  } else if (normalizedType === "Twitter") {
    content = (
      <blockquote className="twitter-tweet">
        <a
          href={link.replace("x.com", "twitter.com")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View Tweet
        </a>
      </blockquote>
    );
  } else if (normalizedType === "Instagram") {
    content = (
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={link}
        data-instgrm-version="14"
        style={{
          background: "#fff",
          border: 0,
          margin: "1em 0",
          padding: 0,
          width: "100%",
        }}
      >
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 underline"
        >
          View Instagram Post
        </a>
      </blockquote>
    );
  } else if (
    ["LinkedIn", "Website", "Article", "Repository"].includes(normalizedType)
  ) {
    if (microlinkPreview) {
      content = (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block border rounded overflow-hidden hover:shadow-lg transition"
        >
          {microlinkPreview.image?.url && (
            <img
              src={microlinkPreview.image.url}
              alt="Preview"
              className="w-full h-48 object-cover max-w-full rounded"
            />
          )}
          <div className="p-3">
            <p className="font-semibold">{microlinkPreview.title}</p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {microlinkPreview.description}
            </p>
          </div>
        </a>
      );
    } else {
      content = (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all"
        >
          {link}
        </a>
      );
    }
  } 
  else if (normalizedType === "Image") {
    content = <img src={link} alt={title} className="w-full rounded-md max-w-full" />;
  } else if (normalizedType === "Video") {
    content = (
      <video controls className="w-full rounded-md max-w-full max-h-[400px]">
        <source src={link} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  } else if (normalizedType === "Document") {
    content = (
      <iframe
        src={link}
        className="w-full h-[300px] rounded border max-w-full"
        title={title}
      />
    );
  } else {
    content = <div className="text-gray-500">Unsupported content type</div>;
  }


  return (
    <Card className="w-full h-full bg-white shadow-xl border border-gray-200 rounded-2xl flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300 p-6 overflow-hidden">
      <CardHeader className="gap-2 p-0 mb-2">
        <CardTitle className="text-lg font-semibold mb-1 break-words">
          <h2 className="text-xl font-semibold tracking-tight text-gray-800">
            {title}
          </h2>
        </CardTitle>
        <CardDescription className="text-muted-foreground mb-2">
          <code className="bg-gray-100 rounded px-2 py-1 font-mono text-sm font-semibold">
            Type: {normalizedType}
          </code>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 p-0 mb-4 overflow-auto">
        <div className="pt-2 break-words max-h-[360px] overflow-auto">{content}</div>
      </CardContent>

      <div className="border-t border-gray-200 my-2"></div>

      <CardFooter className="flex justify-end p-0 pt-4">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">Open</Button>
        </a>
      </CardFooter>
    </Card>
  );
}
