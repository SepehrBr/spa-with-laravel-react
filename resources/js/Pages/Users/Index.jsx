import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { ChevronUpIcon, ChevronDownIcon, ChevronDoubleDownIcon, XMarkIcon } from "@heroicons/react/16/solid";
import TableHeadings from "@/Components/TableHeadings";
import { useEffect, useState } from "react";
import ShowSuccessAlert from "@/Components/ShowSuccessAlert";

export default function index({ auth, users, queryParams = null, success = null }) {
    queryParams = queryParams || {};

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

    const searchHandler = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }

        // add query params to the current url
        router.get(route('users.index'), queryParams)
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
        router.get(route('users.index'), queryParams);
    }

    // delete user
    const deleteUserHandler = (user) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        // send delete request
        router.delete(route('users.destroy', user.id), {
            preserveScroll: true, // Preserve scroll position after deletion
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Users
                    </h2>
                    <Link className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600" href={route('users.create')}>
                        Add New User
                    </Link>
                </div>
            }
        >
            <Head title="Users" />


            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {showSuccess && <ShowSuccessAlert success={success} onClickHandler={closeSuccessHandler}/>}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <TableHeadings name="id" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>ID</TableHeadings>
                                        <TableHeadings name="name" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>Name</TableHeadings>
                                        <TableHeadings name="email" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>Email</TableHeadings>
                                        <TableHeadings name="created_at" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>Created Date</TableHeadings>
                                        <TableHeadings name="updated_at" sort_field={queryParams.sort_field} sort_order={queryParams.sort_order} sortHandler={sortHandler}>Updated Date</TableHeadings>
                                        <th className="px-3 py-2 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"><TextInput
                                                className="w-full"
                                                defaultValue={queryParams.name}
                                                placeholder="Search by Name"
                                                onBlur={e => searchHandler('name', e.target.value)}
                                                onKeyPress={e => onKeyPressHandler('name', e)}
                                            />
                                        </th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.data.map((user) => (
                                            <tr key={user.id} className="bg-white border-b border-gray-800 dark:border-gray-700 dark:bg-gray-800">
                                                <th className="px-3 py-2">{user.id}</th>
                                                <td className="px-3 py-2 text-white">{user.name}</td>
                                                <td className="px-3 py-2 text-nowrap">{user.email}</td>
                                                <td className="px-3 py-2 text-nowrap">{user.created_at}</td>
                                                <td className="px-3 py-2 text-nowrap">{user.updated_at}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <Link href={route('users.edit', user.id)} className="text-blue-500 hover:text-blue-700 mx-2">Edit</Link>
                                                    <button type="button" onClick={e => deleteUserHandler(user)} className="text-red-500 hover:text-red-700 mx-2">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            </div>
                            <Pagination links={users.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
