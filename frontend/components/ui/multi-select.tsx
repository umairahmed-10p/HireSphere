import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onValueChange: (values: string[]) => void
  placeholder?: string
  className?: string
  name?: string
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select options",
  className,
  name,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (option: Option) => {
    const newValues = value.includes(option.value)
      ? value.filter(v => v !== option.value)
      : [...value, option.value]
    
    onValueChange(newValues)
  }

  const handleRemove = (optionToRemove: string) => {
    const newValues = value.filter(v => v !== optionToRemove)
    onValueChange(newValues)
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length > 0 
              ? `${value.length} selected`
              : placeholder
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search options..." />
            <CommandList>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      handleSelect(option)
                      setOpen(true)
                    }}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value.includes(option.value)}
                        className="mr-2"
                        readOnly
                      />
                      {option.label}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <div className="flex flex-wrap gap-1">
        {value.map((selectedValue) => (
          <Badge 
            key={selectedValue} 
            variant="secondary" 
            className="flex items-center"
          >
            {selectedValue}
            <Button
              size="icon"
              variant="ghost"
              className="ml-1 h-4 w-4"
              onClick={() => handleRemove(selectedValue)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      
      {name && (
        <input 
          type="hidden" 
          name={name} 
          value={value.join(',')} 
        />
      )}
    </div>
  )
}
