import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import TasksTable from "./components/TasksTable";
import ShowSuccessAlert from "@/Components/ShowSuccessAlert";
import { useEffect, useState } from "react";

export default function index({ auth, tasks, queryParams = null, success = null }) {
    // disappear success alert
    const [showSuccess, setShowSuccess] = useState(!!success); // convert success to boolean
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setShowSuccess(false); // Hide the success message after 5 seconds
            }, 5000);

            return () => clearTimeout(timer); // Cleanup the timer on component unmount
        }
    }, [success]);
    const closeSuccessHandler = () => setShowSuccess(false); // close alert handler by clicking X button

    return (
        <AuthenticatedLayout
            task={auth.task}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Tasks
                    </h2>
                    <Link className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600" href={route('tasks.create')}>
                        Add New Task
                    </Link>
                </div>
            }
        >
            <Head title="Tasks" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {showSuccess && <ShowSuccessAlert success={success} onClickHandler={closeSuccessHandler}/>}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <TasksTable tasks={tasks} queryParams={queryParams} routeQuery={route('tasks.index')}/>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
