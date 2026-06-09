import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Dispatch, ReactNode, SetStateAction } from "react";

export function DialogComponent({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/*<DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>*/}

      <DialogContent className="sm:max-w-sm">{children}</DialogContent>
    </Dialog>
  );
}
