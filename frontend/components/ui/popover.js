"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/app/lib/util";

/* ======================================================
   Popover Root
====================================================== */
const Popover = PopoverPrimitive.Root;

/* ======================================================
   Popover Trigger
====================================================== */
const PopoverTrigger = PopoverPrimitive.Trigger;

/* ======================================================
   Popover Content
====================================================== */
const PopoverContent = React.forwardRef(
  (
    {
      className,
      align = "center",
      sideOffset = 8,
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          `
          z-50 rounded-md
          bg-popover text-popover-foreground
          shadow-md outline-none
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0
          data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95
          data-[state=open]:zoom-in-95
          data-[side=bottom]:slide-in-from-top-2
          data-[side=left]:slide-in-from-right-2
          data-[side=right]:slide-in-from-left-2
          data-[side=top]:slide-in-from-bottom-2
          `,
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
);

PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
