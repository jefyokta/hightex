import { DashboardTitle } from "@/Components/Dashboardtitle"
import { Expandable, ExpandableCard, ExpandableCardContent, ExpandableCardFooter, ExpandableCardHeader, ExpandableContent, ExpandableTrigger } from "@/Components/expandable-card"
import InputLabel from "@/Components/InputLabel"
import { BentoCard, BentoGrid } from "@/Components/magicui/bento-grid"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInput from "@/Components/TextInput"
import { DocumentData } from "@/types"
import { Link, useForm } from "@inertiajs/react"
import { Avatar } from "@mui/material"
import { TooltipProvider, TooltipContent } from "@radix-ui/react-tooltip"
import { Badge, Calendar, Clock, MapPin, Users, Video, MessageSquare, Paperclip, Newspaper, FileTextIcon, FileEdit, Quote } from "lucide-react"
import { Tooltip, TooltipTrigger, Button } from "react-aria-components"

type DLProps = {
    documentdata: DocumentData
}

const DocumentList: React.FC<DLProps> = ({ documentdata }) => {



    return (<div className="w-full ">
        <DashboardTitle title="Welcome " />

        <div className="w-full">

            <BentoGrid>
                <BentoCard href={`/document/${documentdata.id}/bab1`} cta="Edit" description="Continue to edit your document content" name={documentdata.title} background={<div ></div>} Icon={FileTextIcon} className="col-span-3 lg:col-span-1"/>

                <BentoCard href={`/document/${documentdata.id}/bab1`} cta="See" description="Read documentaton" name={"Need help?"} background={<div ></div>} Icon={FileTextIcon} className="col-span-3 lg:col-span-2"/>
                <BentoCard href={`/document/${documentdata.id}/bab1`} cta="Edit" description="Manage your references" name={documentdata.title} background={<div ></div>} Icon={Quote} className="col-span-3 lg:col-span-2"/>
            </BentoGrid>
        </div>
    </div>

    )
}


export default DocumentList
