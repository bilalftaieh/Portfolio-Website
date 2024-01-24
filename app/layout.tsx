import type { Metadata } from 'next'
import './globals.css'
import AppHeader from '@/components/AppHeader'
import {montserrat_400} from '@/lib/fonts'
import { Providers } from './providers'
import Script from 'next/script'
import { Divider } from '@nextui-org/react'
import AppFooter from '@/components/AppFooter'
import { fetchPages } from '@/lib/butterCmsApi'
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'Belal Alfutayh | Portfolio Website',
  description: 'Belal Alfutayh Portfolio Website that includes everything about him',
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pages = await fetchPages();
  const footerPageData = pages[2].fields 
  return (
    <html lang="en">
      <head>
        <Script
          src="https://kit.fontawesome.com/e9bf30ccfb.js"
          crossOrigin='anonymous'
        />
      </head>
      <body className={`${montserrat_400.className} antialiased
        bg-custom-one text-white`}>
        <Providers>
        <div className='flex flex-col overflow-hidden'>
          <AppHeader/>
          {children}
          <Divider className="bg-custom-three mt-5"/>
          <AppFooter data={footerPageData}/>
        </div>
        </Providers>
        <Analytics/>
        </body>
    </html>
  )
}
