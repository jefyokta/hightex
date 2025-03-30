import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

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
                        <a href="#" className='p-2 px-3 hover:bg-slate-200 rounded-3xl'>Feedback</a>
                        <Link href={auth.user ? "/dashboard" : "/login"} className='p-2 px-3 bg-green-700/90 text-slate-100 ring ring-2 rounded-3xl'>{auth.user ? "Dashboard" : "Login"}</Link>


                    </div>
                </div>
            </div>
            <div className='bg-gradient-to-br border border-white border-b-slate-200/50 from-slate-100 to-green-200/30 via-white w-full h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <h1 className='text-6xl font-bold text-teal-800'>HighTex</h1>
                    <p className='text-slate-400'>Make Your Thesis Easier</p>
                    <div className="py-4">
                        <Link href='#' disabled className='p-2 font-semibold px-3 bg-green-700 text-sm rounded-lg text-white shadow-md my-2 ring ring-green-400/20 ring-4'>Coming Soon</Link>
                    </div>
                </div>
            </div>
            <div className="h-36 w-full"></div>
            <div id="about" className='w-full h-screen p-5 py-20 mt-20 flex '>
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
                    <div className='md:w-1/3 text-justify p-5'>
                        <h1 className='text-5xl text-slate-700 mb-2 font-semibold'>Hightex</h1>
                        <p className='indent-5 text-slate-600'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem veritatis facere perspiciatis architecto ullam voluptatem eaque tenetur debitis quaerat natus harum reiciendis, optio unde iste eos exercitationem, adipisci accusamus aspernatur explicabo repellendus nulla nemo. Odit, fuga inventore nulla facilis quia aperiam distinctio doloribus tempora suscipit dolorem obcaecati pariatur illo labore soluta quis, hic amet eius? Veritatis nemo assumenda excepturi nulla nobis quam, vel voluptatibus ea dolorem dignissimos porro laudantium debitis, aut harum distinctio quo quisquam temporibus maxime enim? Possimus qui vitae, culpa aut quis aspernatur omnis quasi quibusdam, vel nihil dignissimos vero repudiandae, cumque nisi autem. Doloribus vel sunt officia.</p>
                    </div>

                </div>


            </div>

        </>
    );
}
