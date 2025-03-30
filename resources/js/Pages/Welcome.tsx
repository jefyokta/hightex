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
            <div className='bg-gradient-to-br from-slate-100 to-green-200/30 via-white w-full h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <h1 className='text-6xl font-bold text-teal-800'>HighTex</h1>
                    <p className='text-slate-400'>Make Your Thesis Easier</p>
                    <div className="py-4">
                        <Link href='#' disabled className='p-2 font-semibold px-3 bg-green-700 text-sm rounded-lg text-white shadow-md my-2 ring ring-green-400/20 ring-4'>Coming Soon</Link>
                    </div>
                </div>
            </div>

        </>
    );
}
