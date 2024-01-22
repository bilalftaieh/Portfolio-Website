'use client'
import React from 'react';
import Link from 'next/link';
import {
  Navbar, NavbarBrand, NavbarContent,
  NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem,
} from "@nextui-org/react";
import { alegreya_700 } from '@/lib/fonts';

export default function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const items = [{ name: 'HOME', href: '/' }, { name: 'ABOUT', href: '/about' },
  { name: 'PROJECTS', href: '/projects' }]
  return (
    <Navbar className='bg-transparent border-custom-three' isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen} isBordered
      shouldHideOnScroll isBlurred={false}>

      <NavbarContent className='space-x-3'>
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden">
        </NavbarMenuToggle>
        <NavbarBrand >
          <Link href={'/'}>
            <div className='flex items-center space-x-5'>
              <h1 className={`text-2xl font-bold ${alegreya_700.className} text-white`}>BELAL ALFUTAYH</h1>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href={items[1].href}>
            <p className='text-custom-two text-lg hover:text-gray-400'>{items[1].name}</p>
          </Link>

        </NavbarItem>


        <NavbarItem>
          <Link href={items[2].href}>
            <p className='text-custom-two text-lg hover:text-gray-400'>{items[2].name}</p>
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className='bg-custom-one space-y-3'>
        {items.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

    </Navbar>

  );
}