import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth }) {
    const { data, setData, post, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // submit handler
    const submitHandler = (e) => {
        e.preventDefault();
        post(route('tasks.store'), {
            data,
            // reset the form on success
            onSuccess: () => reset(),
            headers: {
                'Content-Type': 'application/json',
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
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form action="" className="p-4 sm:p-8 bg-white dark:bg-gray-800 flex flex-col gap-5 shadow sm:rounded-lg rounded" onSubmit={submitHandler} >
                                <div>
                                    <InputLabel htmlFor="name" value="Task Name" className="mb-2" />
                                    <TextInput id="name" type="text" name="name" value={data.name} className="block w-full" onChange={e => setData('name', e.target.value)} isFocused={true} placeholder="Add Task's Name" />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="email" value="Task Email" className="mb-2" />
                                    <TextInput id="email" type="text" name="email" value={data.email} className="block w-full" onChange={e => setData('email', e.target.value)}  placeholder="Add Task's Email" />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="password" value="Password" className="mb-2" />
                                    <TextInput id="password" type="password" name="password" value={data.password} className="block w-full" onChange={e => setData('password', e.target.value)}  placeholder="********" />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="mb-2" />
                                    <TextInput id="password_confirmation" type="password" name="password_confirmation" value={data.password_confirmation} className="block w-full" onChange={e => setData('password_confirmation', e.target.value)}  placeholder="********" />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
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
