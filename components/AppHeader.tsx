'use client'
import React from 'react';
import Link from 'next/link';
import {
  Navbar, NavbarBrand, NavbarContent,
  NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem,
  Popover, PopoverTrigger, PopoverContent
} from "@nextui-org/react";
import { alegreya_700 } from '@/lib/fonts';

export default function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const items = [{ name: 'ABOUT', href: '' }, { name: 'PROJECTS', href: '' }]
  return (
    <Navbar className='bg-transparent border-custom-three w-full' isMenuOpen={isMenuOpen}
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
          <Popover placement="bottom" showArrow={true} color='primary'>
            <PopoverTrigger>
              <p className='text-gray-600 text-lg'>{items[0].name}</p>
            </PopoverTrigger>
            <PopoverContent>
              <p>Under Development</p>
            </PopoverContent>
          </Popover>
        </NavbarItem>


        <NavbarItem>
          <Popover placement="bottom" showArrow={true} color='primary'>
            <PopoverTrigger>
              <p className='text-gray-600 text-lg'>{items[1].name}</p>
            </PopoverTrigger>
            <PopoverContent>
              <p>Under Development</p>
            </PopoverContent>
          </Popover>
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