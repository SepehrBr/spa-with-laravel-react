import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import RadioInput from "@/Components/RadioInput";
import SelectInput from "@/Components/SelectInput";
import ShowErrorAlert from "@/Components/ShowErrorAlert";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import { TASK_PRIORITY_TEXT_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Create({ auth, projects, users  }) {
    const { data, setData, post, errors, reset } = useForm({
        name: '',
        description: '',
        status: '',
        priority: '',
        image: null,
        due_date: '',
        project: '',
        assigned_to: '',
    });

    // show error alert
    const [showError, setShowError] = useState(!!errors.error); // convert error message into boolean
    useEffect(() => {
        if (errors.error) {
            setShowError(true); // Show the error message when errors.error changes
            const timer = setTimeout(() => {
                setShowError(false); // Hide the error message after 5 seconds
            }, 5000);

            return () => clearTimeout(timer); // Cleanup the timer on component unmount
        }
    }, [errors.error]);
    const closeErrorAlertHandler = () => setShowError(false);

    // submit handler
    const submitHandler = (e) => {
        e.preventDefault();
        post(route('tasks.store'), {
            data,
            // reset the form on success
            onSuccess: () => reset(),
            headers: {
                'Content-Type': 'multipart/form-data' // because of image and file
            }
        });
    }

    return (
        <AuthenticatedLayout
            task={auth.task}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Create New Task
                </h2>
            }
        >
            <Head title="Create New Task" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                { showError && <ShowErrorAlert onClickHandler={closeErrorAlertHandler} error={errors.error}/>}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form action="" className="p-4 sm:p-8 bg-white dark:bg-gray-800 flex flex-col gap-5 shadow sm:rounded-lg rounded" onSubmit={submitHandler} encType="multipart/form-data">
                                <div>
                                    <InputLabel htmlFor="image" value="Task Image" className="mb-2" />
                                    <TextInput id="image" type="file" name="image" className="block w-full" onChange={e => setData('image', e.target.files[0])} />
                                    <InputError message={errors.image} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="name" value="Task Name" className="mb-2" />
                                    <TextInput id="name" type="text" name="name" value={data.name} className="block w-full" onChange={e => setData('name', e.target.value)} isFocused={true} placeholder="Add Task's Name" />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <TextAreaInput id="description" name="description" value={data.description} placeholder="Add Task's Desctiprtion" className="w-full block" onChange={e => setData('description', e.target.value)} />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="status" value="Task Status" className="mb-2" />
                                    <SelectInput id="status" name="status" value={data.status} className="block w-full" onChange={e => setData('status', e.target.value)}
                                    >
                                        <option value="">Select Status</option>
                                        {Object.entries(TASK_STATUS_TEXT_MAP).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </SelectInput>
                                </div>
                                <div>
                                    <InputLabel value="Priority" className="mb-2" />
                                    <div className="flex justify-start items-center gap-3">
                                        {Object.entries(TASK_PRIORITY_TEXT_MAP).map(([key, value]) => (
                                            <RadioInput key={key} name="priority" htmlFor={key} label={value} onChange={(e) => setData('priority', e.target.value)} value={key}/>
                                        ))}
                                    </div>
                                    <InputError message={errors.priority} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="due_date" value="Project Deadline" className="mb-2" />
                                    <TextInput id="due_date" type="date" name="due_date" value={data.due_date} className="block w-full" onChange={e => setData('due_date', e.target.value)} />
                                    <InputError message={errors.due_date} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="project" value="Related Project" className="mb-2" />
                                    <SelectInput id="project" name="project" value={data.project} className="block w-full" onChange={e => setData('project', e.target.value)}
                                    >
                                        <option value="">Select Project</option>
                                        { projects.data.map(project => (
                                                    <option key={project.id} value={project.id}>{project.name}</option>
                                                )
                                            )
                                        }
                                    </SelectInput>
                                    <InputError message={errors.project} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="user" value="Assign To" className="mb-2" />
                                    <SelectInput id="user" name="assigned_to" value={data.assigned_to} className="block w-full" onChange={e => setData('assigned_to', e.target.value)}
                                    >
                                        <option value="">Select User</option>
                                        { users.data.map(user => (
                                                    <option key={user.id} value={user.id}>{user.name}</option>
                                                )
                                            )
                                        }
                                    </SelectInput>
                                    <InputError message={errors.assigned_to} className="mt-2" />
                                </div>
                                <div className="mt-5 text-right">
                                    <Link href={route('tasks.index')} className="bg-gray-100 py-2 px-4 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-3">Cancel</Link>
                                    <button type="submit" className="bg-emerald-500 py-2 px-4 text-white rounded shadow transition-all hover:bg-emerald-600">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
