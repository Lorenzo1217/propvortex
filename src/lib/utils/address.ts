interface ProjectWithAddress {
  address?: string | null
  street?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
}

export function formatProjectAddress(project: ProjectWithAddress): string {
  // If new fields exist, use them
  if (project.street && project.city && project.state && project.zipCode) {
    return `${project.street}, ${project.city}, ${project.state} ${project.zipCode}`
  }
  
  // Fallback to old address field for existing projects
  return project.address || 'No address provided'
}

export function getAddressLine1(project: ProjectWithAddress): string {
  return project.street || project.address?.split(',')[0] || ''
}

export function getAddressLine2(project: ProjectWithAddress): string {
  if (project.city && project.state && project.zipCode) {
    return `${project.city}, ${project.state} ${project.zipCode}`
  }
  
  // Try to parse from old address format
  const parts = project.address?.split(',') || []
  return parts.slice(1).join(',').trim() || ''
}