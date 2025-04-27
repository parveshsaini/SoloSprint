"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useTheme } from "next-themes";
import { Moon, Sun  } from 'lucide-react';

export default function ThemeToggler() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu >
      <DropdownMenuTrigger className="outline-none cursor-pointer">
        {resolvedTheme === "light" ? <Sun className=" flex items-center w-5 h-5 hover:scale-125 transition-all"/> : <Moon className="flex items-center w-4 h-4 hover:scale-125 transition-all"/>}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="cursor-pointer">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}