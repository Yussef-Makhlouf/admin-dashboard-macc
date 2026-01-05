import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#15AC9E]/50 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#15AC9E] text-white hover:bg-[#129687] shadow-sm hover:shadow-md rounded-full",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 rounded-full shadow-sm",
        outline:
          "border-2 border-[#15AC9E] text-[#15AC9E] bg-transparent hover:bg-[#15AC9E] hover:text-white rounded-full",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-full",
        ghost:
          "hover:bg-gray-100 text-gray-700 hover:text-gray-900 rounded-xl",
        link: "text-[#15AC9E] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base rounded-[40px]",
        xl: "h-14 px-10 text-base rounded-[40px]",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
