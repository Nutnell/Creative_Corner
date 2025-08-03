"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSidebar } from "@/contexts/SidebarContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, PenTool, FileText, User, X } from "lucide-react"

const navigation = [
  { name: "All Posts", href: "/", icon: Home, public: true },
  { name: "Dashboard", href: "/dashboard", icon: User, protected: true },
  { name: "Create Post", href: "/create", icon: PenTool, protected: true },
  { name: "My Posts", href: "/my-posts", icon: FileText, protected: true },
]

export function Sidebar() {
  const { user } = useAuth()
  const { isOpen, close } = useSidebar()
  const pathname = usePathname()

  const filteredNavigation = navigation.filter((item) => item.public || (item.protected && user))

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={close} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform bg-background border-r transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b md:hidden">
          <span className="font-semibold">Navigation</span>
          <Button variant="ghost" size="icon" onClick={close}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
