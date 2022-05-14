import React from 'react'

export default function Header({ user }) {
  return (
    <div>
        <div className='px-10 py-5'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-white text-4xl'>Edvora</h1>
                </div>

                <div>
                    <div className='flex items-center gap-6'>
                        <p className='font-bold text-white text-xl'>{user.name}</p>
                        <img src={user.url} alt="" className='rounded-full w-11 h-11' />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
