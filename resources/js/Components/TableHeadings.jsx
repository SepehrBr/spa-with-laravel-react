import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";

export default function TableHeadings({ name, sortable = true, sort_field = null, sort_order = null, children, sortHandler = () => {} }) {
    return (
        <th onClick={e => sortHandler(name)} >
            <div className="px-3 py-2 flex items-center justify-between gap-1 cursor-pointer">
                {children}
                {sortable && (
                    <div>
                        <ChevronUpIcon className={"w-4 -mb-2" + (sort_field === name && sort_order === 'asc' ? ' text-white ' : '')} />
                        <ChevronDownIcon className={"w-4 " + (sort_field === name && sort_order === 'desc' ? ' text-white ' : '')} />
                    </div>
                )}
            </div>
        </th>
    )
}
