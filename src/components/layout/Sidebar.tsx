"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Plus, Home } from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Notes", href: "/dashboard/notes", icon: FileText },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold">AI Notes</h1>
      </div>
      <nav className="mt-5 flex-1 px-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                pathname === item.href
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50",
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              )}
              onClick={onClose} // Close sidebar when clicking on mobile
            >
              <Icon
                className={cn(
                  pathname === item.href
                    ? "text-gray-500"
                    : "text-gray-400",
                  "mr-3 flex-shrink-0 h-6 w-6"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Button className="w-full" asChild>
          <Link href="/dashboard/notes/new" onClick={onClose}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>
    </div>
  );
}