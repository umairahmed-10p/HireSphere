"use client"

import { BarChart3, BriefcaseBusiness, Calendar, Home, PanelLeft, Plus, Settings, Sparkles, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()

  const mainNavItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      title: "Roles",
      icon: BriefcaseBusiness,
      href: "/roles",
    },
    {
      title: "Candidates",
      icon: Users,
      href: "/candidates",
    },
    {
      title: "Interviews",
      icon: Calendar,
      href: "/interviews",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics",
    },
    {
      title: "AI Tools",
      icon: Sparkles,
      href: "/ai-tools",
    },
  ]

  return (
    <Sidebar data-variant="inset" collapsible="icon" className="flex">
      <div className="flex h-full w-full flex-col gap-2">
        <SidebarHeader className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white">
              HS
            </div>
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">HireSphere</span>
          </div>
          <SidebarTrigger>
            <Button variant="ghost" size="icon">
              <PanelLeft className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
        </SidebarHeader>
        <SidebarContent className="flex flex-col h-[calc(100vh-4rem)]">
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href} className="flex items-center w-full px-3 py-2">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="ml-3 group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="group-data-[collapsible=icon]:hidden">
                <Button
                  size="default"
                  className="w-full flex items-center justify-start px-3 py-2"
                  variant="outline"
                  asChild
                >
                  <Link href="/roles/new">
                    <Plus className="h-4 w-4 flex-shrink-0" />
                    <span className="ml-3">Post New Role</span>
                  </Link>
                </Button>
              </div>
              <div className="hidden group-data-[collapsible=icon]:block">
                <SidebarMenuButton asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-full flex items-center px-3 py-2"
                    asChild
                  >
                    <Link href="/roles/new">
                      <Plus className="h-4 w-4" />
                    </Link>
                  </Button>
                </SidebarMenuButton>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                <Link href="/settings" className="flex items-center w-full px-3 py-2">
                  <Settings className="h-4 w-4 flex-shrink-0" />
                  <span className="ml-3 group-data-[collapsible=icon]:hidden">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
