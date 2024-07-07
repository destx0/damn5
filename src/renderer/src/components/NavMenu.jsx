import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import ImportExportCard from '@/components/ImportExportCard'
import { Home, UserPlus, FileDown } from 'lucide-react'

const NavMenu = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive('/')}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/add-student" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              active={isActive('/add-student')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <FileDown className="mr-2 h-4 w-4" />
            Import/Export
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ImportExportCard />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default NavMenu
