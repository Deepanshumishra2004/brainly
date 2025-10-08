import { TwitterIcon } from "@/icons/TwitterIcon";


import { use, useEffect, useState } from "react";
import { Button } from "./Button";
import { ShareIcon } from "../../icons/ShareIcon";

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

export function ShareButton(){


    return <div>
        <Dialog>
              <DialogTrigger asChild>
                <Button onClick={} variant="secondary">
                  <ShareIcon /> Share
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share link</DialogTitle>
                  <DialogDescription>
                    you can take the kink of the content.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                    <Input id="link" defaultValue={} readOnly />
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    </div>
}