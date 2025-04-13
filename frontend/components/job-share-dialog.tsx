"use client"

import React, { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  Facebook, 
  Linkedin, 
  Mail, 
  Share2, 
  Twitter, 
  Copy 
} from "lucide-react"
import { toast } from 'sonner'
import { Job } from '@/lib/api/jobs'

interface JobShareDialogProps {
  job: Job
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobShareDialog({ job, open, onOpenChange }: JobShareDialogProps) {
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/${job.id}`
  
  const socialShareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this job opening: ${job.title} at ${job.company}`)}`
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success('Job link copied to clipboard')
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Job Opening: ${job.title}`)
    const body = encodeURIComponent(`
Check out this exciting job opportunity!

Job Title: ${job.title}
Company: ${job.company}
Location: ${job.location}

View full details: ${shareUrl}
    `)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const handleSocialShare = (platform: keyof typeof socialShareLinks) => {
    window.open(socialShareLinks[platform], '_blank', 'width=600,height=400')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Job Listing</DialogTitle>
          <DialogDescription>
            Share this job opening with your network
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => handleSocialShare('linkedin')}
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => handleSocialShare('facebook')}
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => handleSocialShare('twitter')}
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleEmailShare}
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
          
          <Button 
            variant="outline" 
            className="col-span-2 gap-2" 
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
