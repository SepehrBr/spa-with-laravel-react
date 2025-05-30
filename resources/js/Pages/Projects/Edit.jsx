import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import ShowErrorAlert from "@/Components/ShowErrorAlert";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import { PROJECT_STATUS_TEXT_MAP } from "@/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Edit({ auth, project }) {
    const { data, setData, post, errors, reset } = useForm({
        _method: 'PUT',
        name: project.name || '',
        image: null,
        image_path: project.image_path || null,
        description: project.description || '',
        due_date: project.due_date || '',
        status: project.status || '',
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
        post(route('projects.update', project.id), {
            data,
            onSuccess: () => reset(), // reset the form on success
            headers: {
                'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data for file upload
            }
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Edit Project "{project.name}"
                </h2>
            }
        >
            <Head title={`Edit Project ${project.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                { showError && <ShowErrorAlert onClickHandler={closeErrorAlertHandler} error={errors.error}/>}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        {project.image_path && (
                            <div>
                                <img src={project.image_path} alt="" className="w-full h-64 object-cover"/>
                            </div>
                        )}
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form action="" className="p-4 sm:p-8 bg-white dark:bg-gray-800 flex flex-col gap-5 shadow sm:rounded-lg rounded" onSubmit={submitHandler} enctype="multipart/form-data" >
                                <div>
                                    <InputLabel htmlFor="image" value="Project Image" className="mb-2" />
                                    <TextInput id="image" type="file" name="image" className="block w-full" onChange={e => setData('image', e.target.files[0])} />
                                    <InputError message={errors.image} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="name" value="Project Name" className="mb-2" />
                                    <TextInput id="name" type="text" name="name" value={data.name} className="block w-full" onChange={e => setData('name', e.target.value)} isFocused={true} placeholder="Add Project's Name" />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <TextAreaInput id="description" name="description" value={data.description} placeholder="Add Project's Desctiprtion" className="w-full block" onChange={e => setData('description', e.target.value)} />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="due_date" value="Project Deadline" className="mb-2" />
                                    <TextInput id="due_date" type="date" name="due_date" value={data.due_date} className="block w-full" onChange={e => setData('due_date', e.target.value)} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="status" value="Project Status" className="mb-2" />
                                    <SelectInput id="status" name="status" value={data.status} className="block w-full" onChange={e => setData('status', e.target.value)}
                                    >
                                        <option value="">Select Status</option>
                                        {Object.entries(PROJECT_STATUS_TEXT_MAP).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </SelectInput>
                                </div>
                                <div className="mt-5 text-right">
                                    <Link href={route('projects.index')} className="bg-gray-100 py-2 px-4 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-3">Cancel</Link>
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
