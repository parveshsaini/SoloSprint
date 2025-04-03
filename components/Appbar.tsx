"use client"

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Appbar = () => {

    const {status, data: session} = useSession()
  return (
    <header>
      <nav>
        {status === 'authenticated' ? (
            <div>
                WELCOME {session?.user?.name} <br />
                <Image
                    src={session?.user?.image!}
                    alt="user image"
                    width={50}
                    height={50}
                    className="rounded-full"
                />

                <Link href="/api/auth/signout" className='bg-red-500 text-white p-2 rounded-md'>Sign Out</Link>
            </div>
        ) :
        <Link href="/api/auth/signin" className='bg-blue-500 text-white p-2 rounded-md'>Sign In</Link>
        }

      </nav>
    </header>
  )
}

export default Appbar
