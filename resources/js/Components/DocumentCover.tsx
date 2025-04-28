import { User } from "@/types"
import LogoUin from "@/Images/logo-uin.png"

export type DocumenrCoverProps = {
    user: User,
    documentTitle: string

}

export const DocumentCover: React.FC<DocumenrCoverProps> = ({ user, documentTitle }) => {
    return (
        <div className="w-[21cm] h-[29cm]">
            <div className="flex justify-center w-full">
                <img src={LogoUin} alt="" />
            </div>
            <div className="students text-center w-full">
                <h1>{user.name}</h1>
                <p>{user.email.split("@")[0]}</p>
            </div>
        </div>
    )
}
