import React from 'react'

const SkeletonNav = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
        <div className="container flex flex-col items-center justify-between p-6 mx-auto space-y-4 animate-pulse sm:space-y-0 sm:flex-row">
            
                <p className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></p>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
                
                <p className="w-20 h-2 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>
                <p className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></p>
        </div>
    </section>
  )
}

export default SkeletonNav