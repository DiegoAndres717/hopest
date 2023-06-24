import React from 'react'

const SkeletonPerfil = () => {
  return (
    <section class="bg-white dark:bg-gray-900">
    <div class="container px-6 py-10 mx-auto animate-pulse">
        <div class="grid grid-cols-1 gap-8 mt-8 xl:mt-16">
            <div class="flex flex-col items-center p-8">
                <p class="w-32 h-32 bg-gray-200 rounded-full dark:bg-gray-700 ring-4 ring-gray-300 dark:ring-gray-600"></p>
                <h1 class="w-40 h-2 mx-auto mt-6 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>

                <p class="w-32 h-2 mx-auto mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>

                <p class="w-56 h-2 mx-auto mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            </div>
        </div>
    </div>
</section>
  )
}

export default SkeletonPerfil