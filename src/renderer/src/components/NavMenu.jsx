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

const NavMenu = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} active={isActive('/')}>
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
              Add Student
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Import/Export</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ImportExportCard />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default NavMenu
