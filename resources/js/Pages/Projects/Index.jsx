import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { ChevronUpIcon, ChevronDownIcon, ChevronDoubleDownIcon } from "@heroicons/react/16/solid";
import TableHeadings from "@/Components/TableHeadings";

export default function index({ auth, projects, queryParams = null }) {
    queryParams = queryParams || {};
    const searchHandler = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }

        // add query params to the current url
        router.get(route('projects.index', queryParams))
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
        router.get(route('projects.index', queryParams));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Projects
                </h2>
            }
        >
            <Head title="Projects" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <TableHeadings name="id" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>ID</TableHeadings>
                                        <th className="px-3 py-2">Image</th>
                                        <TableHeadings name="name" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>Name</TableHeadings>
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
                                        <th className="px-3 py-2"><TextInput
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
                                                {Object.entries(PROJECT_STATUS_TEXT_MAP).map(([key, value]) => (
                                                    <option key={key} value={key}>{value}</option>
                                                ))}
                                            </SelectInput>
                                        </th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        projects.data.map((project) => (
                                            <tr key={project.id} className="bg-white border-b border-gray-800 dark:border-gray-700 dark:bg-gray-800">
                                                <th className="px-3 py-2">{project.id}</th>
                                                <td className="px-3 py-2">
                                                    <img src={project.image_path} alt="" style={{ width: 60 }} />
                                                </td>
                                                <td className="px-3 py-2">{project.name}</td>
                                                <td className="px-3 py-2">
                                                    <span className={"px-2 py-1 rounded text-xs text-white font-bold " + PROJECT_STATUS_CLASS_MAP[project.status]}>
                                                        {PROJECT_STATUS_TEXT_MAP[project.status]}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-nowrap">{project.created_at}</td>
                                                <td className="px-3 py-2 text-nowrap">{project.due_date}</td>
                                                <td className="px-3 py-2">{project.createdBy.name}</td>
                                                <td className="px-3 py-2">
                                                    <Link href={route('projects.edit', project.id)} className="text-blue-500 hover:text-blue-700 mx-2">Edit</Link>
                                                    <Link href={route('projects.show', project.id)} className="text-yellow-500 hover:text-yellow-700 mx-2">View</Link>
                                                    <Link href={route('projects.destroy', project.id)} className="text-red-500 hover:text-red-700 mx-2">Delete</Link>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            </div>
                            <Pagination links={projects.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
