import { usePage } from "@inertiajs/react"


type ImageListProps = {
    images: string[]

}
const ImageList: React.FC<ImageListProps> = ({ images }) => {

    const { props } = usePage()
    const user = props.auth.user.id
    return (<div className="p-5">
        <h1 className="font-semibold text-lg mb-5">Images</h1>
        <div className="w-full space-x-1 flex">
        {images ? <div>hon</div> : ""}

            {images && images.map((img, i) => {
                return <button key={i} className="overflow-hidden shadow-md focus:border-blue-500 focus:border-2 rounded-md">
                    <img src={img} alt="" className="w-24" />
                </button>
            })}
        </div>
    </div>
    )

}

export default ImageList
