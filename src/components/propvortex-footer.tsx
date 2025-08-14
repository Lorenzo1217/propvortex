import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default function PropVortexFooter() {
  return (
    <footer className="propvortex-footer mt-auto py-4 px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <span>Made with</span>
          <Link 
            href="https://propvortex.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Building2 className="h-3 w-3" />
            <span className="font-medium">PropVortex</span>
          </Link>
          <span>•</span>
          <span>Construction Project Management</span>
        </div>
      </div>
    </footer>
  )
}