"use client"

import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description: string
  actionLabel?: string
  actionLink?: string
}

export function PageHeader({ title, description, actionLabel, actionLink }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {actionLabel && actionLink && (
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href={actionLink}>
              <Plus className="mr-2 h-4 w-4" />
              {actionLabel}
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
