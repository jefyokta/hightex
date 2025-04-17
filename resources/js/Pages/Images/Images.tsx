import Authenticated from "@/Layouts/AuthenticatedLayout"
import { ImagesProps } from "@/types"
import { usePage } from "@inertiajs/react"



const Images: React.FC = () => {

    // const props = usePage<ImagesProps>()
    return <Authenticated>
        <div className="p-10">
            <div className="text-3xl font-semibold">Your Images</div>
        </div>
    </Authenticated>
}

export default Images
