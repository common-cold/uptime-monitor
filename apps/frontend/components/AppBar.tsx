"use client";

import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'

export function AppBar() {
    return <div className='flex justify-between p-4'>
        <div>Uptime-Monitor</div>
        <div>
            <SignedOut>
                <div className='flex gap-4'>
                    <div>
                        <SignInButton />
                    </div>
                    <div>
                        <SignUpButton />
                    </div>
                </div>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div> 
    </div>
}