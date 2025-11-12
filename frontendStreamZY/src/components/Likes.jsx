import React from 'react'
import SideVideosItems from './SideVideosItems'

export default function Likes() {

    return (
        <div className="ml-2 lg:ml-20">
            <div className="min-h-screen w-full bg-slate-100 dark:bg-[#121212]/100 text-gray-100 dark:text-gray-100">
                <div className="lg:flex-row lg:items-start gap-8 px-4 lg:px-10">

                    <div className="lg:fixed  lg:top-20 flex flex-col lg:h-screen h-full bg-black/50 dark:bg-white/5 backdrop-blur-2xl rounded-2xl py-10 px-9 lg:w-1/3 w-full shadow-sm overflow-hidden relative items-center mb-5">

                        <img
                            src="https://i.ytimg.com/vi/tgbNymZ7vqY/maxresdefault.jpg"
                            alt="Liked videos background"
                            className="absolute inset-0 object-cover w-full h-full opacity-100 blur-[6px]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/60 to-transparent rounded-2xl"></div>

                        <div className="lg:hidden flex flex-1 justify-center items-center">
                            <div className="relative z-10 h-[50%] w-[40%]">
                                <img src="https://sdmntpraustraliaeast.oaiusercontent.com/files/00000000-b568-61fa-a0d6-17600d8179e2/raw?se=2025-11-09T14%3A21%3A25Z&sp=r&sv=2024-08-04&sr=b&scid=aa6202f6-8c15-9790-8776-b3011992b702&skoid=9063adf3-a524-4acf-b70a-8731b33f2f50&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-09T05%3A38%3A07Z&ske=2025-11-10T05%3A38%3A07Z&sks=b&skv=2024-08-04&sig=CG8p4/X1jERmOJLTyv6ig5ZNBGyRhDkTfBf0dk1K4NQ%3D" alt="thumb1" className="rounded-lg object-cover w-full h-full" />
                            </div>

                            <div className="relative z-10 p-3 m-3">
                                <h2 className="text-3xl lg:text-4xl font-bold mb-3">Liked videos</h2>
                                <p className="text-gray-300 text-sm mb-4">Akash Tiwari •  videos</p>
                            </div>
                        </div>
                        <div className="hidden lg:flex">
                            <div className="relative z-10">
                                <img src="https://sdmntpraustraliaeast.oaiusercontent.com/files/00000000-b568-61fa-a0d6-17600d8179e2/raw?se=2025-11-09T14%3A21%3A25Z&sp=r&sv=2024-08-04&sr=b&scid=aa6202f6-8c15-9790-8776-b3011992b702&skoid=9063adf3-a524-4acf-b70a-8731b33f2f50&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-09T05%3A38%3A07Z&ske=2025-11-10T05%3A38%3A07Z&sks=b&skv=2024-08-04&sig=CG8p4/X1jERmOJLTyv6ig5ZNBGyRhDkTfBf0dk1K4NQ%3D" alt="thumb1" className="rounded-lg object-cover w-full" />

                                <div className="relative z-10 p-3 lg:m-5">
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-3">Liked videos</h2>
                                    <p className="text-gray-300 text-sm mb-4">Akash Tiwari •  videos</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col lg:ml-[40%] px-auto mt-3 gap-4">
                        <div className=" text-center mr-5 text-3xl font-[800] text-gray-800 dark:text-gray-300 w-44">All Liked Vidoes</div>
                          <div className="py-0 dark:text-white"><hr/></div>
                        <SideVideosItems />
                        <SideVideosItems />
                        <SideVideosItems />
                        <SideVideosItems />
                        <SideVideosItems />
                        <SideVideosItems />
                        <SideVideosItems />
                    </div>
                </div>
            </div>
        </div>
    )
}
