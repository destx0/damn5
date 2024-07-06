import React from 'react'
import { MoreVertical, UserCircle, Printer, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export const ActionCellRenderer = (params) => {
  const handleView = () => {
    console.log('View clicked for row:', params.data)
    // Add your view logic here
  }

  const handlePrint = () => {
    console.log('Print clicked for row:', params.data)
    // Add your print logic here
  }

  const handleDelete = () => {
    console.log('Delete clicked for row:', params.data)
    // Add your delete logic here
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <UserCircle className="mr-2 h-4 w-4 text-blue-500" />
          <span>View</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4 text-green-500" />
          <span>Print</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
