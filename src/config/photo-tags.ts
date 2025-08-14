export const PHOTO_TAGS = {
  // Room/Area Tags
  areas: [
    'Kitchen',
    'Master Bedroom',
    'Guest Bedroom',
    'Master Bathroom',
    'Guest Bathroom',
    'Living Room',
    'Dining Room',
    'Family Room',
    'Office',
    'Garage',
    'Basement',
    'Attic',
    'Exterior',
    'Front Yard',
    'Backyard',
    'Pool Area',
    'Driveway',
    'Entryway',
    'Hallway',
    'Laundry Room',
    'Mudroom',
    'Deck/Patio'
  ],
  
  // Construction Phase Tags
  phases: [
    'Pre-Construction',
    'Site Prep',
    'Foundation',
    'Framing',
    'Roofing',
    'Electrical',
    'Plumbing',
    'HVAC',
    'Insulation',
    'Drywall',
    'Flooring',
    'Painting',
    'Trim Work',
    'Cabinetry',
    'Countertops',
    'Tile Work',
    'Landscaping',
    'Final Touches',
    'Punch List',
    'Complete'
  ],
  
  // Material/Feature Tags
  features: [
    'Windows',
    'Doors',
    'Lighting',
    'Appliances',
    'Fixtures',
    'Hardware',
    'Stone Work',
    'Wood Work',
    'Custom Built-ins',
    'Fireplace',
    'Ceiling Fan',
    'Crown Molding',
    'Backsplash',
    'Shower',
    'Bathtub',
    'Vanity',
    'Shelving',
    'Closet'
  ],
  
  // Issue/Status Tags
  issues: [
    'Issue',
    'Damage',
    'Repair Needed',
    'Change Order',
    'Inspection',
    'Progress Update',
    'Before',
    'After',
    'Detail Shot'
  ]
}

export const TAG_CATEGORIES = {
  areas: { label: 'Areas', color: 'blue' },
  phases: { label: 'Construction Phases', color: 'green' },
  features: { label: 'Features', color: 'purple' },
  issues: { label: 'Status/Issues', color: 'orange' }
} as const

export const ALL_TAGS = [
  ...PHOTO_TAGS.areas,
  ...PHOTO_TAGS.phases,
  ...PHOTO_TAGS.features,
  ...PHOTO_TAGS.issues
].sort()

export function parseTags(tagsString: string | null): string[] {
  if (!tagsString) return []
  try {
    const parsed = JSON.parse(tagsString)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags)
}

export function getTagCategory(tag: string): keyof typeof TAG_CATEGORIES | null {
  if (PHOTO_TAGS.areas.includes(tag)) return 'areas'
  if (PHOTO_TAGS.phases.includes(tag)) return 'phases'
  if (PHOTO_TAGS.features.includes(tag)) return 'features'
  if (PHOTO_TAGS.issues.includes(tag)) return 'issues'
  return null
}

export function getTagColor(tag: string): string {
  const category = getTagCategory(tag)
  if (!category) return 'gray'
  
  const colors = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200'
  }
  
  return colors[TAG_CATEGORIES[category].color] || colors.gray
}

export function getTagBadgeColor(tag: string): string {
  const category = getTagCategory(tag)
  if (!category) return 'bg-gray-100 text-gray-700'
  
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700'
  }
  
  return colors[TAG_CATEGORIES[category].color] || 'bg-gray-100 text-gray-700'
}