import Pagination from "@/Components/Pagination";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function index({ auth, projects}) {

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
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2">ID</th>
                                        <th className="px-3 py-2">Image</th>
                                        <th className="px-3 py-2">Name</th>
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2">Created Date</th>
                                        <th className="px-3 py-2">Due Date</th>
                                        <th className="px-3 py-2">Created By</th>
                                        <th className="px-3 py-2 text-center">Actions</th>
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
                            <Pagination links={projects.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
