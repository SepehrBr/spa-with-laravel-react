import { USER_STATUS_CLASS_MAP, USER_STATUS_TEXT_MAP } from "@/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import TasksTable from "../Tasks/components/TasksTable";

export default function Show({ auth, user, tasks, queryParams }) {
console.log(user)
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    This is {user.name}
                </h2>
            }
        >
            <Head title={`User ${user.id}`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div>
                            <img src={user.image_path} alt="" className="w-full h-64 object-cover"/>
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="grid gap-1 grid-cols-2 mt-2">
                                <div className="flex flex-col gap-7">
                                    <div>
                                        <label className="font-bold text-lg">User ID</label>
                                        <p className="mt-1">{user.id}</p>
                                    </div>
                                    <div>
                                        <label className="font-bold text-lg">User Name</label>
                                        <p className="mt-1">{user.name}</p>
                                    </div>
                                    <div>
                                        <label className="font-bold text-lg">User Status</label>
                                        <p className="mt-1">
                                            <span className={"px-2 py-1 rounded text-xs text-white font-bold " + USER_STATUS_CLASS_MAP[user.status]}>
                                                {USER_STATUS_TEXT_MAP[user.status]}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="font-bold text-lg">Created By</label>
                                        <p className="mt-1">{user.createdBy.name}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-7">
                                    <div>
                                        <label className="font-bold text-lg">Due Date</label>
                                        <p className="mt-1">{user.due_date}</p>
                                    </div>
                                    <div>
                                        <label className="font-bold text-lg">Created Date</label>
                                        <p className="mt-1">{user.created_at}</p>
                                    </div>
                                    <div>
                                        <label className="font-bold text-lg">Updated By</label>
                                        <p className="mt-1">{user.updatedBy.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <label className="font-bold text-lg">Description</label>
                                <p className="mt-1">{user.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        {
                            tasks.length > 0
                            ?
                            <TasksTable tasks={tasks} queryParams={queryParams} routeQuery={route('users.show', user.id)}/>
                            :
                            <div className="p-6 text-gray-900 dark:text-gray-100 flex items-center justify-center gap-4">
                                <p className="text-center">No tasks found for this user.</p>
                                <Link href={route('tasks.create')} className="text-blue-500 hover:underline">Create One?</Link>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
