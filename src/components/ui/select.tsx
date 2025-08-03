"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simple HTML select component that looks like the other UI components
interface SimpleSelectProps {
  name?: string
  defaultValue?: string
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function SimpleSelect({ name, defaultValue, disabled, children, className }: SimpleSelectProps) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      disabled={disabled}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
    </select>
  )
}

// Simple option component
interface SelectItemProps {
  value: string
  children: React.ReactNode
}

export function SelectItem({ value, children }: SelectItemProps) {
  return (
    <option value={value}>{children}</option>
  )
}

// Dummy exports for compatibility (not used but prevents errors)
export const Select = SimpleSelect
export const SelectGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const SelectValue = ({ placeholder }: { placeholder?: string }) => <option value="" disabled>{placeholder}</option>
export const SelectTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>