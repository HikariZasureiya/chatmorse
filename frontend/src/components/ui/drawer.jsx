import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

function Drawer({ ...props }) {
  return (
    <DrawerPrimitive.Root
      setBackgroundColorOnScale={false}
      data-slot="drawer"
      {...props}
    />
  );
}

function DrawerTrigger({ ...props }) {
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      {...props}
    />
  );
}

function DrawerPortal({  className, ...props  }) {
  return (
    <DrawerPrimitive.Portal
    className={cn("p-0 m-0 bg-transparent", className)}
      data-slot="drawer-portal"
      {...props}
    />
  );
}

function DrawerClose({ ...props }) {
  return (
    <DrawerPrimitive.Close
      setBackgroundColorOnScale={false}
      data-slot="drawer-close"
      {...props}
    />
  );
}

function DrawerOverlay({ className, ...props }) {
  return (
    <DrawerPrimitive.Overlay
      setBackgroundColorOnScale={false}
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  );
}

function DrawerContent({ className, children, ...props }) {
  return (
    <DrawerPortal setBackgroundColorOnScale={false} data-slot="drawer-portal">
      <DrawerOverlay setBackgroundColorOnScale={false} />
      <DrawerPrimitive.Content
        setBackgroundColorOnScale={false}
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        <div className=" mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }) {
  return (
    <DrawerPrimitive.Title
      setBackgroundColorOnScale={false}
      data-slot="drawer-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }) {
  return (
    <DrawerPrimitive.Description
      setBackgroundColorOnScale={false}
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export const DrawerCSSProvider = ({ children }) => {
  return (
    <div vaul-drawer-wrapper="">
      <div className="relative flex flex-col">
        {children}
      </div>
    </div>
  );
};

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
