import { ContainerScroll } from '@/Components/ui/container-scroll-animation';
import { FloatingDock } from '@/Components/ui/floationg-dock';
import { HeroSection } from '@/Components/ui/hero-section-demo-1';
import { TypewriterEffect, } from '@/Components/ui/typewriter-effect';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Table, Image, Quote, Sigma } from "lucide-react";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {

    return (
        <>
            <Head title="Welcome" />
            <div className="flex fixed w-full justify-center p-3" style={{ zIndex: 100 }}>
                <div className=" border  border-slate-200/70 border-1 bg-white/70 backdrop-blur shadow-lg p-3 px-4 rounded-3xl text-sm " style={{ margin: "auto" }}>
                    <div className='font-semibold space-x-1 py-1 text-slate-500'>
                        <a href="#about" className='p-2 px-3 hover:bg-slate-200 rounded-3xl'>About</a>
                        <Link href="#" className='p-2 px-3 hover:bg-slate-200 rounded-3xl'>Docs</Link>
                        <a href="#" className='p-2 px-3 hover:bg-slate-200 rounded-3xl'>Feedback</a>
                        <Link href={auth.user ? "/dashboard" : "/login"} className='p-2 px-3 bg-green-700/90 text-slate-100 ring ring-2 rounded-3xl'>{auth.user ? "Dashboard" : "Login"}</Link>


                    </div>
                </div>
            </div>
            <div className='bg-gradient-to-br border border-white border-b-slate-200/50 from-slate-100 to-green-200/30 via-white w-full h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <h1 className='text-6xl font-bold text-teal-800'>HighTex</h1>
                    <p className='text-slate-400 my-5'>A thesis editor for Students o Information System UIN SUSKA </p>
                    <div className="py-4">
                        <Link href='#' disabled className='p-2 font-semibold px-3 bg-green-700 text-sm rounded-lg text-white shadow-md my-2 ring ring-green-400/20 ring-4'>Coming Soon</Link>
                    </div>
                </div>
            </div>
                <ContainerScroll titleComponent={<ScrollContainerTitle />}>
                    <div className="border-2 border-gray-300 h-full rounded-xl overflow-hidden flex flex-col">
                        <div className="w-full h-11 border-b-2 border-gray-300 bg-gray-50 flex items-center space-x-1.5 px-3">
                            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        </div>

                        <div className="flex-1 flex justify-center items-center p-4 overflow-auto bg-gray-100">
                            <div className="relative w-full h-full flex justify-center items-start">
                                <div className="origin-top scale-[0.65] sm:scale-[0.75] md:scale-[0.85] lg:scale-100 transition-transform duration-300">
                                    <div
                                        style={{ fontFamily: "Times New Roman" }}
                                        className="w-[21cm] h-[29.7cm] bg-white px-[3cm] pt-[2.5cm] pb-[3cm] text-[12pt] leading-[1.8] text-black shadow-md"
                                    >
                                        <h1 className="text-center font-bold text-[13pt] mb-6">
                                            BAB I<br />PENDAHULUAN
                                        </h1>

                                        <h2 className="font-bold text-[12pt] mb-2">1.1 Latar Belakang</h2>


                                        <TypewriterEffect
                                            words={[
                                                {
                                                    text:
                                                        "Penulisan ini bertujuan untuk memberikan pemahaman mengenai pentingnya penggunaan teknologi dalam menunjang sistem informasi pada era digital ini.",
                                                    className: "text-justify ",
                                                },
                                            ]}
                                            className="text-[12pt] indent-0 leading-[1.8]"
                                            cursorClassName="bg-black ml-1"
                                        />

                                        <h2 className="font-bold text-[12pt] mb-2">1.2 Rumusan Masalah</h2>
                                        <p className="text-justify indent-10 mb-5">
                                            Berdasarkan latar belakang tersebut ...
                                        </p>
                                    </div>
                                    <div className="sticky bottom-0 flex justify-center">
                                        <FloatingDock desktopClassName='shadow-md' items={[{ title: "Table", icon: (<Table />), href: "" }, { title: "Image", icon: (<Image />), href: "" }, { title: "Citation", icon: (<Quote />), href: "" }, { title: "Math", icon: (<Sigma />), href: "" }]} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </ContainerScroll>



            <div id="about" className='w-full h-screen p-5 py-5  relative'>
                <div className='text-center  mb-30  py-5'>
                    <h1 className='my-10 mb-15 text-6xl font-semibold'>Features</h1>
                    <div className="flex justify-center space-x-10">
                        <div className='text-center flex justify-center flex-col items-center'>
                            <div className='w-24'>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M8.93934 14.4393C8.5 14.8787 8.5 15.5858 8.5 17V19C8.5 20.4142 8.5 21.1213 8.93934 21.5607C9.37868 22 10.0858 22 11.5 22H12.5C13.9142 22 14.6213 22 15.0607 21.5607C15.5 21.1213 15.5 20.4142 15.5 19V17C15.5 15.5858 15.5 14.8787 15.0607 14.4393C14.6213 14 13.9142 14 12.5 14H11.5C10.0858 14 9.37868 14 8.93934 14.4393ZM10.25 18C10.25 17.5858 10.5858 17.25 11 17.25H13C13.4142 17.25 13.75 17.5858 13.75 18C13.75 18.4142 13.4142 18.75 13 18.75H11C10.5858 18.75 10.25 18.4142 10.25 18Z" fill="#1C274C"></path> <path opacity="0.5" d="M22 12.3529C22 15.2327 19.8188 17.6089 17 17.9563L15.5 17.9629V17C15.5 15.5858 15.5 14.8787 15.0607 14.4393C14.6213 14 13.9142 14 12.5 14H11.5C10.0858 14 9.37868 14 8.93934 14.4393C8.5 14.8787 8.5 15.5858 8.5 17V17.9934L7.00002 18H6.28571C3.91878 18 2 16.1038 2 13.7647C2 11.4256 3.91878 9.52941 6.28571 9.52941C6.56983 9.52941 6.8475 9.55673 7.11616 9.60887C6.88706 8.9978 6.7619 8.33687 6.7619 7.64706C6.7619 4.52827 9.32028 2 12.4762 2C15.4159 2 17.8371 4.19371 18.1551 7.01498C20.393 7.78024 22 9.88113 22 12.3529Z" fill="#1C274C"></path> </g></svg>
                            </div>
                            <p className='text-sm font-semibold'>Stored Document</p>
                        </div>
                        <div className='text-center flex justify-center flex-col items-center'>
                            <div className='w-24'>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z" fill="#1C274C"></path> <path d="M16.5189 16.5013C16.6939 16.3648 16.8526 16.2061 17.1701 15.8886L21.1275 11.9312C21.2231 11.8356 21.1793 11.6708 21.0515 11.6264C20.5844 11.4644 19.9767 11.1601 19.4083 10.5917C18.8399 10.0233 18.5356 9.41561 18.3736 8.94849C18.3292 8.82066 18.1644 8.77687 18.0688 8.87254L14.1114 12.8299C13.7939 13.1474 13.6352 13.3061 13.4987 13.4811C13.3377 13.6876 13.1996 13.9109 13.087 14.1473C12.9915 14.3476 12.9205 14.5606 12.7786 14.9865L12.5951 15.5368L12.3034 16.4118L12.0299 17.2323C11.9601 17.4419 12.0146 17.6729 12.1708 17.8292C12.3271 17.9854 12.5581 18.0399 12.7677 17.9701L13.5882 17.6966L14.4632 17.4049L15.0135 17.2214L15.0136 17.2214C15.4394 17.0795 15.6524 17.0085 15.8527 16.913C16.0891 16.8004 16.3124 16.6623 16.5189 16.5013Z" fill="#1C274C"></path> <path d="M22.3665 10.6922C23.2112 9.84754 23.2112 8.47812 22.3665 7.63348C21.5219 6.78884 20.1525 6.78884 19.3078 7.63348L19.1806 7.76071C19.0578 7.88348 19.0022 8.05496 19.0329 8.22586C19.0522 8.33336 19.0879 8.49053 19.153 8.67807C19.2831 9.05314 19.5288 9.54549 19.9917 10.0083C20.4545 10.4712 20.9469 10.7169 21.3219 10.847C21.5095 10.9121 21.6666 10.9478 21.7741 10.9671C21.945 10.9978 22.1165 10.9422 22.2393 10.8194L22.3665 10.6922Z" fill="#1C274C"></path> <path fillRule="evenodd" clipRule="evenodd" d="M7.25 9C7.25 8.58579 7.58579 8.25 8 8.25H14.5C14.9142 8.25 15.25 8.58579 15.25 9C15.25 9.41421 14.9142 9.75 14.5 9.75H8C7.58579 9.75 7.25 9.41421 7.25 9ZM7.25 13C7.25 12.5858 7.58579 12.25 8 12.25H11C11.4142 12.25 11.75 12.5858 11.75 13C11.75 13.4142 11.4142 13.75 11 13.75H8C7.58579 13.75 7.25 13.4142 7.25 13ZM7.25 17C7.25 16.5858 7.58579 16.25 8 16.25H9.5C9.91421 16.25 10.25 16.5858 10.25 17C10.25 17.4142 9.91421 17.75 9.5 17.75H8C7.58579 17.75 7.25 17.4142 7.25 17Z" fill="#1C274C"></path> </g></svg>
                            </div>
                            <p className='text-sm font-semibold'>Formatted Document</p>
                        </div>

                        <div className='text-center flex justify-center flex-col items-center'>
                            <div className='w-24'>
                                <svg viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" className='' d="M17.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2Z" fill="#1C274C"></path> <path d="M10.5 8.81006H6C5.59 8.81006 5.25 8.47006 5.25 8.06006C5.25 7.65006 5.59 7.31006 6 7.31006H10.5C10.91 7.31006 11.25 7.65006 11.25 8.06006C11.25 8.47006 10.91 8.81006 10.5 8.81006Z" fill="#1C274C"></path> <path d="M18 14.8101H13.5C13.09 14.8101 12.75 14.4701 12.75 14.0601C12.75 13.6501 13.09 13.3101 13.5 13.3101H18C18.41 13.3101 18.75 13.6501 18.75 14.0601C18.75 14.4701 18.41 14.8101 18 14.8101Z" fill="#1C274C"></path> <path d="M18 18.5601H13.5C13.09 18.5601 12.75 18.2201 12.75 17.8101C12.75 17.4001 13.09 17.0601 13.5 17.0601H18C18.41 17.0601 18.75 17.4001 18.75 17.8101C18.75 18.2201 18.41 18.5601 18 18.5601Z" fill="#1C274C"></path> <path d="M18 7.31006H16.52V5.81006C16.52 5.40006 16.18 5.06006 15.77 5.06006C15.36 5.06006 15.02 5.40006 15.02 5.81006V7.31006H13.5C13.09 7.31006 12.75 7.65006 12.75 8.06006C12.75 8.47006 13.09 8.81006 13.5 8.81006H15.02V10.3101C15.02 10.7201 15.36 11.0601 15.77 11.0601C16.18 11.0601 16.52 10.7201 16.52 10.3101V8.81006H18C18.41 8.81006 18.75 8.47006 18.75 8.06006C18.75 7.65006 18.41 7.31006 18 7.31006Z" fill="#1C274C"></path> <path d="M9.30945 15.9399L11.0295 14.2199C11.3195 13.9299 11.3195 13.4499 11.0295 13.1599C10.7395 12.8699 10.2595 12.8699 9.96945 13.1599L8.24945 14.8799L6.52945 13.1599C6.23945 12.8699 5.75945 12.8699 5.46945 13.1599C5.17945 13.4499 5.17945 13.9299 5.46945 14.2199L7.18945 15.9399L5.46945 17.6599C5.17945 17.9499 5.17945 18.4299 5.46945 18.7199C5.61945 18.8699 5.80945 18.9399 5.99945 18.9399C6.18945 18.9399 6.37945 18.8699 6.52945 18.7199L8.24945 16.9999L9.96945 18.7199C10.1195 18.8699 10.3095 18.9399 10.4995 18.9399C10.6895 18.9399 10.8795 18.8699 11.0295 18.7199C11.3195 18.4299 11.3195 17.9499 11.0295 17.6599L9.30945 15.9399Z" fill="#1C274C"></path> </g></svg>
                            </div>
                            <p className='text-sm font-semibold'>Math Support</p>
                        </div>
                    </div>
                </div>
                <div className="md:flex w-full flex-row-reverse">
                    <div className="md:w-2/3 px-5 py-10 relative  my-5 " style={{ perspective: '1000px' }}>
                        <img
                            src="/ss.png"
                            alt="ss"
                            className="w-11/12 rounded-xl border border-green-700/10 -translate-x-10 shadow-lg transform-gpu rotate-y-[-30deg] rotate-x-[10deg] translate-z-[12px]"
                        />
                        <img
                            src="/ss.png"
                            alt="ss"
                            className="w-11/12 rounded-xl brightness-70 blur-[1px] shadow-lg transform-gpu rotate-y-[-30deg] rotate-x-[10deg] translate-z-[12px] absolute  top-0 -z-50"
                        />
                    </div>
                    <div className='md:w-1/3 text-justify p-5 relative'>
                        <h1 className='text-5xl text-slate-700 mb-2 font-semibold'>Hightex</h1>
                        <p className='indent-5 text-slate-600'>
                            A Web Based Document Editor designed to simplify the process of writing, formatting, and managing
                            academic documents. With HighTex, students can effortlessly create structured reports, ensuring compliance with academic writing standards. HighTex empowers users to focus on their content
                            without worrying about formatting complexities.
                        </p>
                        <p className="indent-5 text-slate-600 mt-5">
                            Featuring an intuitive interface and essential writing tools, HighTex streamlines the document creation process,
                            allowing students to organize their ideas effectively. With autosave and offline access, users can work anytime,
                            anywhere, without the fear of losing progress.
                        </p>
                    </div>

                </div>


            </div>
            <HeroSection  className='mt-96'>



</HeroSection>

        </>
    );

}

const ScrollContainerTitle: React.FC = () => {
    return <div><h1 className="text-5xl font-bold my-5 text-green-700">A Web Based Editor</h1></div>
}
