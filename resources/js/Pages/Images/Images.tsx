import FileUploader from "@/Components/comp-547"
import GalleryDemo from "@/Components/Gallery"
import { ExpandableCard } from "@/Components/ui/expandable-card"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { cn } from "@/lib/utils"
import { ImagesProps } from "@/types"
import { usePage } from "@inertiajs/react"



const Images: React.FC = () => {

    const { props } = usePage<ImagesProps>()

    console.log(props.images)

    return <Authenticated>
        <div className="p-10 relative">
            <div className="p-5 bg-white rounded-lg my-5">
                <div className="text-4xl text-center my-5 font-semibold">Your Images</div>


                <div className="relative flex  w-full items-center justify-center bg-white dark:bg-black">
                    <div
                        className={cn(
                            "absolute inset-0",
                            "[background-size:20px_20px]",
                            "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                            "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
                        )}
                    />
                    <div className="py-10 flex justify-center space-x-5 flex-wrap gap-4 ">
                        {props.images.map(i => {
                            return <ExpandableCard key={i.name} description={`${(i.size / (1024 * 1024)).toFixed(2)}MB`} src={`/image/${i.id}`} title={`image#${i.id}`} id={i.id} />

                        })}

                    </div>
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

                </div>
            </div>

            <div className=" text-center p-10 space-y-10 bg-white shadow-sm rounded-lg">
                <h2 className="text-3xl font-semibold">Upload New Images</h2>
                <div className="flex justify-center">
                    <div className="w-96">
                        <FileUploader />
                    </div>
                </div>
            </div>
            <div className="fixed p-5 z-49 top-20 right-10 w-56 min-h-18 space-y-2 shadow rounded-md bg-white">
                <p className="text-xs text-slate-500">Storage</p>
                <Progress value={props.used} max={props.limit}></Progress>

            </div>
        </div>






    </Authenticated>
}

const Progress: React.FC<{ value: number; max: number }> = ({ value, max }) => {

    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const getColor = (percent: number) => {
        if (percent < 30) return "bg-green-500";
        if (percent < 70) return "bg-yellow-400";
        return "bg-red-500";
    };

    return (
        <>
            <div className="w-full h-2 bg-slate-200 rounded-md overflow-hidden">
                <div
                    className={`h-2 ${getColor(percentage)} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-[.5em] text-slate-600">{((max - value) / (1024 * 1024)).toFixed(2)}MB Available</p>
        </>
    );
};

export default Images
