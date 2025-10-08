import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/CardInfo";
import { PlusIcon } from "@/icons/PlusIcon";
import { ShareIcon } from "@/icons/ShareIcon";
import { BrainIcon } from "@/icons/BrainIcon";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardWithSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <div className="p-4">
          <div className="font-bold text-lg mb-4">Brainly</div>
          <nav>
            <a href="#" className="block py-2 px-4 rounded hover:bg-accent">All Items</a>
            <a href="#" className="block py-2 px-4 rounded hover:bg-accent">Twitter</a>
            <a href="#" className="block py-2 px-4 rounded hover:bg-accent">Youtube</a>
          </nav>
        </div>
      </Sidebar>
      <main className="ml-64 p-8">
        <h1 className="text-2xl font-bold">Dashboard Content</h1>
      </main>
    </SidebarProvider>
  );
} 