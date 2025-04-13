"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { candidatesApi } from "@/lib/api/candidates"
import { toast } from "sonner"

export function AddCandidateForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    profile: {
      skills: [] as string[],
      location: '',
      bio: ''
    }
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Handle nested profile fields
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim())
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Call the API to create a new candidate
      const newCandidate = await candidatesApi.createCandidate(formData)
      
      // Show success toast
      toast.success('Candidate added successfully')
      
      // Close the dialog
      setIsOpen(false)
      
      // Optionally, refresh the page or redirect
      router.refresh()
    } catch (error) {
      console.error('Failed to add candidate:', error)
      toast.error('Failed to add candidate')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex gap-2">
          <Plus className="h-4 w-4" />
          Add Candidate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3" 
              placeholder="Enter candidate's full name"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input 
              id="email" 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="col-span-3" 
              placeholder="Enter candidate's email"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile.skills" className="text-right">
              Skills
            </Label>
            <Input 
              id="profile.skills" 
              name="profile.skills"
              value={formData.profile.skills.join(', ')}
              onChange={handleSkillsChange}
              className="col-span-3" 
              placeholder="Enter skills (comma-separated)"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile.location" className="text-right">
              Location
            </Label>
            <Input 
              id="profile.location" 
              name="profile.location"
              value={formData.profile.location}
              onChange={handleInputChange}
              className="col-span-3" 
              placeholder="Enter candidate's location"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile.bio" className="text-right">
              Bio
            </Label>
            <Input 
              id="profile.bio" 
              name="profile.bio"
              value={formData.profile.bio}
              onChange={handleInputChange}
              className="col-span-3" 
              placeholder="Enter a short bio"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
              Avatar URL
            </Label>
            <Input 
              id="avatar" 
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              className="col-span-3" 
              placeholder="Optional avatar URL"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              Add Candidate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
