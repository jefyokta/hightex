import { MainContext } from "@/Context/MainContext"
import { Switch } from "@headlessui/react"
import { Editor } from "@tiptap/react"
import {
    PlusCircleIcon,
    Trash2Icon,
    SplitIcon,
    AlignLeftIcon,
    AlignCenterIcon,
    RowsIcon,
    ColumnsIcon,
    LucideTableCellsMerge,
} from "lucide-react"
import { useContext } from "react"

const ActionButton = ({
    onClick,
    disabled,
    label,
    icon: Icon,
    className = "",
    labelClass = "",
    iconClass = "",
}: {
    onClick: () => void
    disabled?: boolean
    label?: string
    icon: React.ElementType
    className?: string,
    labelClass?: string,
    iconClass?: string
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition disabled:opacity-40 ${className}`}
    >
        <Icon size={14} className={iconClass ? iconClass : `text-gray-700`} />
        {label && <span className={labelClass ? labelClass : `text-gray-800`}>{label}</span>}
    </button>
)

const TableSetting: React.FC = () => {
    const ctx = useContext(MainContext)
    const editor = ctx?.editor

    return (
        <div className="p-4  space-y-4 text-sm text-gray-700">
            {/* Column Controls */}
            <div className="space-y-2">
                <h2 className="font-medium flex items-center gap-1 text-sm text-gray-800">
                    <ColumnsIcon size={16} />
                    Column
                </h2>
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <ActionButton
                            icon={PlusCircleIcon}
                            onClick={() => editor?.chain().focus().addColumnAfter().run()}
                            disabled={!editor?.can().addColumnAfter()}
                        />
                        <ActionButton
                            icon={Trash2Icon}
                            onClick={() => editor?.chain().focus().deleteColumn().run()}
                            disabled={!editor?.can().deleteColumn()}
                        />
                    </div>
                    <div className="flex gap-2">
                        <ActionButton
                            icon={LucideTableCellsMerge}
                            label="Merge"
                            onClick={() => editor?.chain().focus().mergeCells().run()}
                            disabled={!editor?.can().mergeCells()}
                        />
                        <ActionButton
                            icon={SplitIcon}
                            label="Split"
                            onClick={() => editor?.chain().focus().splitCell().run()}
                            disabled={!editor?.can().splitCell()}
                        />
                    </div>
                </div>
                <div className="flex gap-2 mt-1">
                    <ActionButton
                        icon={AlignLeftIcon}
                        label="Left"
                        onClick={() => editor?.chain().focus().setCellAlignmentLeft().run()}
                        disabled={!editor?.can().setCellAlignmentLeft()}

                    />
                    <ActionButton
                        icon={AlignCenterIcon}
                        label="Center"
                        onClick={() => editor?.chain().focus().setCellAlignmentCenter().run()}

                        disabled={!editor?.can().setCellAlignmentCenter()}
                    />
                </div>
            </div>

            {/* Row Controls */}
            <div className="space-y-2">
                <h2 className="font-medium flex items-center gap-1 text-sm text-gray-800">
                    <RowsIcon size={16} />
                    Row
                </h2>
                <div className="flex gap-2">
                    <ActionButton
                        icon={PlusCircleIcon}
                        label="Add"
                        onClick={() => editor?.chain().focus().addRowAfter().run()}
                        disabled={!editor?.can().addRowAfter()}
                    />
                    <ActionButton
                        icon={Trash2Icon}
                        label="Delete"
                        onClick={() => editor?.chain().focus().deleteRow().run()}
                        disabled={!editor?.can().deleteRow()}
                    />
                </div>
            </div>

            {/* Helper & Delete */}
            <div className="space-y-2 my-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs">Show edge helper</span>
                    <Switch
                        checked={ctx?.tableHelper}
                        onChange={() => ctx?.setTableHelper(!ctx.tableHelper)}
                        className={`${ctx?.tableHelper ? "bg-gray-800" : "bg-gray-300"
                            } relative inline-flex h-5 w-10 items-center rounded-full transition-colors`}
                    >
                        <span
                            className={`${ctx?.tableHelper ? "translate-x-5" : "translate-x-1"
                                } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                </div>
                <div className="my-5">
                    <ActionButton
                        icon={Trash2Icon}
                        label="Delete Table"
                        labelClass="text-red-500"
                        iconClass="text-red-500"
                        onClick={() => editor?.chain().focus().deleteNode("figureTable").run()}
                        className="w-full justify-center bg-transparent"
                        disabled={!editor?.can().deleteNode("figureTable")}
                    />
                </div>
            </div>
        </div>
    )
}

export default TableSetting
