import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TableHeadings from "@/Components/TableHeadings";
import TextInput from "@/Components/TextInput";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import { Link, router } from "@inertiajs/react";

export default function TasksTable({ tasks, queryParams = null, routeQuery }) {
    queryParams = queryParams || {};

    const searchHandler = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }

        // add query params to the current url
        router.get(routeQuery, queryParams)
    }
    const onKeyPressHandler = (name, event) => {
        if (event.key != 'Enter') return;

        searchHandler(name, event.target.value);
    }

    // sorting handlers
    const sortHandler = (field) => {
        if (field === queryParams.sort_field) {
            if (queryParams.sort_order === 'asc') {
                queryParams.sort_order = 'desc';
            } else {
                queryParams.sort_order = 'asc';
            }
        } else {
            queryParams.sort_field = field;
            queryParams.sort_order = 'asc';
        }

        // add to curent url
        router.get(routeQuery, queryParams);
    }

    return (
        <>
            <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <TableHeadings name="id" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>ID</TableHeadings>
                            <th className="px-3 py-2">Image</th>
                            <th className="px-3 py-2">Project Name</th>
                            <TableHeadings name="name" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>Task Name</TableHeadings>
                            <TableHeadings name="status" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>Status</TableHeadings>
                            <TableHeadings name="created_at" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>Created Date</TableHeadings>
                            <TableHeadings name="due_date" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>Due Date</TableHeadings>
                            <TableHeadings name="created_by" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>Created By</TableHeadings>
                            <th className="px-3 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2">
                                <TextInput
                                    className="w-full"
                                    defaultValue={queryParams.name}
                                    placeholder="Search by Name"
                                    onBlur={e => searchHandler('name', e.target.value)}
                                    onKeyPress={e => onKeyPressHandler('name', e)}
                                />
                            </th>
                            <th className="px-3 py-2">
                                <SelectInput
                                    className="w-full"
                                    defaultValue={queryParams.status}
                                    onChange={e => searchHandler('status', e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    {Object.entries(TASK_STATUS_TEXT_MAP).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </SelectInput>
                            </th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2"></th>
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tasks.data.map((task) => (
                                <tr key={task.id} className="bg-white border-b border-gray-800 dark:border-gray-700 dark:bg-gray-800">
                                    <th className="px-3 py-2">{task.id}</th>
                                    <td className="px-3 py-2">
                                        <img src={task.image_path} alt="" style={{ width: 60 }} />
                                    </td>
                                    <td className="px-3 py-2">
                                        <Link href={route('projects.show', task.project.id)} className="text-white font-bold hover:underline text-nowrap">{task.project.name}</Link>
                                    </td>
                                    <td className="px-3 py-2">
                                        <Link href={route('tasks.show', task.id)} className="text-white font-bold hover:underline">{task.name}</Link>
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={"px-2 py-1 rounded text-xs text-white font-bold " + TASK_STATUS_CLASS_MAP[task.status]}>
                                            {TASK_STATUS_TEXT_MAP[task.status]}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-nowrap">{task.created_at}</td>
                                    <td className="px-3 py-2 text-nowrap">{task.due_date}</td>
                                    <td className="px-3 py-2">{task.createdBy.name}</td>
                                    <td className="px-3 py-2">
                                        <Link href={route('tasks.edit', task.id)} className="text-blue-500 hover:text-blue-700 mx-2">Edit</Link>
                                        <Link href={route('tasks.show', task.id)} className="text-yellow-500 hover:text-yellow-700 mx-2">View</Link>
                                        <Link href={route('tasks.destroy', task.id)} className="text-red-500 hover:text-red-700 mx-2">Delete</Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <Pagination links={tasks.meta.links} />
        </>
    )
}
