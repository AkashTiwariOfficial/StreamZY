import React from 'react'
import SideVideosItems from './SideVideosItems'

export default function Viewplaylists() {
    return (
        <div className="ml-2 lg:ml-20">
            <div className="min-h-screen w-full bg-slate-100 dark:bg-[#121212]/100 text-gray-100 dark:text-gray-100">
                <div className="lg:flex-row lg:items-start gap-8 px-4 lg:px-10">

                    <div className="lg:fixed lg:top-20 flex flex-col lg:h-screen h-full bg-black/50 dark:bg-white/5 backdrop-blur-2xl rounded-2xl py-10 px-9 lg:w-1/3 w-full shadow-sm overflow-hidden relative items-center mb-5">

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

                            <div className="relative z-10 py-3 px-1">
                                <h2 className="text-xl lg:text-xl font-bold mb-3 line-clamp-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, ducimus dolor velit, a rem delectus nam quia expedita officia laudantium harum mollitia enim blanditiis, eius ullam fugit? Autem, fuga velit?</h2>
                                <p className="text-gray-300 text-sm mb-1">Akash Tiwari •  Cartoon</p>
                                <div className="flex gap-3">
                                 <p className="text-gray-300 text-sm mb-1">100 videos</p>
                                 <p className="text-gray-300 text-sm mb-1">Last Updated At 7 March 2027</p>   </div>
                                   <p className="text-gray-300 text-sm mb-1 line-clamp-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit nisi accusantium odit harum qui assumenda hic id, quas quia totam laboriosam, magnam quod veniam quasi officiis officia, ad dolor. Consectetur. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni nesciunt obcaecati, in, voluptatum amet labore aliquid maxime dicta tenetur odio nemo, harum exercitationem ex. Debitis blanditiis amet reiciendis aut voluptatem. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam nemo magnam repudiandae inventore in, saepe dolorem! Quae, quidem. Atque quis molestias, assumenda accusantium maiores aut commodi libero tempore doloremque illo.</p>
                               
                             </div>
                        </div>
                        <div className="hidden lg:flex">
                            <div className="relative z-10">
                                <img src="https://sdmntpraustraliaeast.oaiusercontent.com/files/00000000-b568-61fa-a0d6-17600d8179e2/raw?se=2025-11-09T14%3A21%3A25Z&sp=r&sv=2024-08-04&sr=b&scid=aa6202f6-8c15-9790-8776-b3011992b702&skoid=9063adf3-a524-4acf-b70a-8731b33f2f50&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-09T05%3A38%3A07Z&ske=2025-11-10T05%3A38%3A07Z&sks=b&skv=2024-08-04&sig=CG8p4/X1jERmOJLTyv6ig5ZNBGyRhDkTfBf0dk1K4NQ%3D" alt="thumb1" className="rounded-lg object-cover w-full" />

                                <div className="relative z-10 py-3 px-1">
                                    <h2 className="text-xl lg:text-xl font-bold mb-3 line-clamp-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. At ratione alias ducimus laboriosam molestias, dignissimos eum nostrum velit, sunt similique, modi pariatur quod facere reprehenderit vitae consequuntur eveniet. Architecto, exercitationem.</h2>
                                    <p className="text-gray-300 text-sm mb-4">Akash Tiwari •  Nature</p>
                                     <div className="flex gap-3">
                                 <p className="text-gray-300 text-sm mb-1">100 videos</p>
                                 <p className="text-gray-300 text-sm mb-1">Last Updated At 7 March 2027</p> </div>
                                 <p className="text-gray-300 text-sm mb-1 line-clamp-9">Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit nisi accusantium odit harum qui assumenda hic id, quas quia totam laboriosam, magnam quod veniam quasi officiis officia, ad dolor. Consectetur. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni nesciunt obcaecati, in, voluptatum amet labore aliquid maxime dicta tenetur odio nemo, harum exercitationem ex. Debitis blanditiis amet reiciendis aut voluptatem. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam nemo magnam repudiandae inventore in, saepe dolorem! Quae, quidem. Atque quis molestias, assumenda accusantium maiores aut commodi libero tempore doloremque illo.</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col lg:ml-[40%] px-auto mt-1 gap-4">
                      
                        <div className="py-0 dark:text-white"><hr /></div>
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
