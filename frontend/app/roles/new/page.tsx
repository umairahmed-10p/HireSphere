'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { jobsApi, Job } from '@/lib/api/jobs'
import { toast } from 'sonner'
import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, AlertCircle, Loader2 } from 'lucide-react'

export default function JobRolePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('id')

  const [isLoading, setIsLoading] = useState(false)
  const [newRole, setNewRole] = useState<Partial<Job>>({
    title: '',
    description: '',
    department: '',
    location: '',
    salary: 0,
    jobOverview: [],
    responsibilities: [],
    team: '',
    status: 'OPEN',
    company: '',
    hiringManager: ''
  })

  // Validation state to track which fields are invalid
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string
  }>({})

  // Fetch job details for editing
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        try {
          setIsLoading(true)
          const jobDetails = await jobsApi.getJobById(jobId)
          setNewRole({
            ...jobDetails,
            jobOverview: jobDetails.jobOverview || [],
            responsibilities: jobDetails.responsibilities || []
          })
        } catch (error) {
          console.error('Error fetching job details:', error)
          toast.error('Failed to load job details')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchJobDetails()
  }, [jobId])

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    // Required fields validation
    const requiredFields = [
      { key: 'title', message: 'Job Title is required' },
      { key: 'description', message: 'Job Description is required' },
      { key: 'company', message: 'Company is required' },
      { key: 'department', message: 'Department is required' },
      { key: 'location', message: 'Location is required' },
      { key: 'team', message: 'Team is required' },
      { key: 'hiringManager', message: 'Hiring Manager is required' }
    ]

    requiredFields.forEach(field => {
      if (!newRole[field.key as keyof Partial<Job>] || 
          (typeof newRole[field.key as keyof Partial<Job>] === 'string' && 
           (newRole[field.key as keyof Partial<Job>] as string).trim() === '')) {
        errors[field.key] = field.message
      }
    })

    // Job Overview validation
    if (!newRole.jobOverview || newRole.jobOverview.length === 0) {
      errors['jobOverview'] = 'At least one Job Overview point is required'
    }

    // Responsibilities validation
    if (!newRole.responsibilities || newRole.responsibilities.length === 0) {
      errors['responsibilities'] = 'At least one Responsibility is required'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddListItem = (field: 'jobOverview' | 'responsibilities', newItem: string) => {
    if (newItem.trim()) {
      setNewRole(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), newItem.trim()]
      }))
      // Clear any previous validation error for this field
      setValidationErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleRemoveListItem = (field: 'jobOverview' | 'responsibilities', indexToRemove: number) => {
    setNewRole(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleSubmitRole = async () => {
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      // Get the current user's ID from authentication context
      const currentUser = await getCurrentUser()

      // Prepare job data with default values and user ID
      const jobToSubmit = {
        ...newRole,
        userId: currentUser?.id, // Use optional chaining to safely get user ID
        jobOverview: newRole.jobOverview?.filter(item => item.trim() !== '') || [],
        responsibilities: newRole.responsibilities?.filter(item => item.trim() !== '') || [],
        status: newRole.status || 'OPEN',
      } as Job

      // Determine if we're creating or updating
      let result
      if (jobId) {
        // Update existing job
        result = await jobsApi.updateJob(jobId, jobToSubmit)
        toast.success('Job updated successfully!')
      } else {
        // Create new job
        result = await jobsApi.createJob(jobToSubmit)
        toast.success('New job created successfully!')
      }
      
      router.push('/roles') // Navigate to roles page
    } catch (error) {
      console.error('Error submitting job:', error)
      toast.error(`Failed to ${jobId ? 'update' : 'create'} job`)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to render validation error
  const renderValidationError = (field: string) => {
    if (validationErrors[field]) {
      return (
        <div className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="mr-2 h-4 w-4" />
          {validationErrors[field]}
        </div>
      )
    }
    return null
  }

  // Determine page title and button text
  const pageTitle = jobId ? 'Edit Job Role' : 'Create New Job Role'
  const submitButtonText = jobId ? 'Update Role' : 'Create Role'

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input 
                  id="title" 
                  value={newRole.title} 
                  onChange={(e) => {
                    setNewRole({...newRole, title: e.target.value})
                    // Clear validation error when user starts typing
                    setValidationErrors(prev => {
                      const newErrors = {...prev}
                      delete newErrors['title']
                      return newErrors
                    })
                  }} 
                  placeholder="e.g. Senior Software Engineer" 
                  className={validationErrors.title ? 'border-red-500' : ''}
                />
                {renderValidationError('title')}
              </div>
              <div>
                <Label htmlFor="hiringManager">Hiring Manager</Label>
                <Input 
                  id="hiringManager" 
                  value={newRole.hiringManager} 
                  onChange={(e) => {
                    setNewRole({...newRole, hiringManager: e.target.value})
                    setValidationErrors(prev => {
                      const newErrors = {...prev}
                      delete newErrors['hiringManager']
                      return newErrors
                    })
                  }} 
                  placeholder="Name of hiring manager" 
                  className={validationErrors.hiringManager ? 'border-red-500' : ''}
                />
                {renderValidationError('hiringManager')}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea 
                id="description" 
                value={newRole.description} 
                onChange={(e) => {
                  setNewRole({...newRole, description: e.target.value})
                  setValidationErrors(prev => {
                    const newErrors = {...prev}
                    delete newErrors['description']
                    return newErrors
                  })
                }} 
                placeholder="Provide a detailed job description" 
                rows={4}
                className={validationErrors.description ? 'border-red-500' : ''}
              />
              {renderValidationError('description')}
            </div>

            <div>
              <Label>Job Overview</Label>
              <div className="space-y-2">
                {newRole.jobOverview?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input 
                      value={item} 
                      readOnly 
                      className="flex-grow" 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleRemoveListItem('jobOverview', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Input 
                    id="newOverviewItem" 
                    placeholder="Add job overview point" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.target as HTMLInputElement
                        handleAddListItem('jobOverview', input.value)
                        input.value = ''
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const input = document.getElementById('newOverviewItem') as HTMLInputElement
                      if (input.value.trim()) {
                        handleAddListItem('jobOverview', input.value)
                        input.value = ''
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
              </div>
              {renderValidationError('jobOverview')}
            </div>

            <div>
              <Label>Responsibilities</Label>
              <div className="space-y-2">
                {newRole.responsibilities?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input 
                      value={item} 
                      readOnly 
                      className="flex-grow" 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleRemoveListItem('responsibilities', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Input 
                    id="newResponsibilityItem" 
                    placeholder="Add responsibility" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.target as HTMLInputElement
                        handleAddListItem('responsibilities', input.value)
                        input.value = ''
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const input = document.getElementById('newResponsibilityItem') as HTMLInputElement
                      if (input.value.trim()) {
                        handleAddListItem('responsibilities', input.value)
                        input.value = ''
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
              </div>
              {renderValidationError('responsibilities')}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={newRole.company} 
                  onChange={(e) => {
                    setNewRole({...newRole, company: e.target.value})
                    setValidationErrors(prev => {
                      const newErrors = {...prev}
                      delete newErrors['company']
                      return newErrors
                    })
                  }} 
                  placeholder="Company name" 
                  className={validationErrors.company ? 'border-red-500' : ''}
                />
                {renderValidationError('company')}
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={newRole.location} 
                  onChange={(e) => {
                    setNewRole({...newRole, location: e.target.value})
                    setValidationErrors(prev => {
                      const newErrors = {...prev}
                      delete newErrors['location']
                      return newErrors
                    })
                  }} 
                  placeholder="e.g. Remote, New York" 
                  className={validationErrors.location ? 'border-red-500' : ''}
                />
                {renderValidationError('location')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  value={newRole.department} 
                  onChange={(e) => {
                    setNewRole({...newRole, department: e.target.value})
                    setValidationErrors(prev => {
                      const newErrors = {...prev}
                      delete newErrors['department']
                      return newErrors
                    })
                  }} 
                  placeholder="e.g. Engineering" 
                  className={validationErrors.department ? 'border-red-500' : ''}
                />
                {renderValidationError('department')}
              </div>
              <div>
                <Label htmlFor="team">Team</Label>
                <Input 
                  id="team" 
                  value={newRole.team} 
                  onChange={(e) => {
                    setNewRole({...newRole, team: e.target.value})
                    setValidationErrors(prev => {
                      const newErrors = {...prev}
                      delete newErrors['team']
                      return newErrors
                    })
                  }} 
                  placeholder="e.g. Frontend Development" 
                  className={validationErrors.team ? 'border-red-500' : ''}
                />
                {renderValidationError('team')}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => router.push('/roles')}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitRole} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {submitButtonText}
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
