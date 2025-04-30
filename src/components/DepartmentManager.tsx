'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_DEPARTMENTS,
  CREATE_DEPARTMENT,
  UPDATE_DEPARTMENT,
  DELETE_DEPARTMENT,
} from '../graphql/queries';
import { PlusIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SubDepartment {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  subDepartments: SubDepartment[];
}

interface DepartmentResponse {
  departments: Department[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export default function DepartmentManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [departmentName, setDepartmentName] = useState('');
  const [subDepartments, setSubDepartments] = useState<string[]>(['']);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data, loading, error } = useQuery<{ getDepartments: DepartmentResponse }>(GET_DEPARTMENTS, {
    variables: { page: currentPage, limit: itemsPerPage },
    fetchPolicy: 'cache-and-network',
  });

  const [createDepartment] = useMutation(CREATE_DEPARTMENT, {
    refetchQueries: [{ 
      query: GET_DEPARTMENTS, 
      variables: { page: currentPage, limit: itemsPerPage } 
    }],
    onError: (error) => {
      console.error('Error creating department:', error);
      alert(error.message);
    }
  });

  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT, {
    refetchQueries: [{ 
      query: GET_DEPARTMENTS, 
      variables: { page: currentPage, limit: itemsPerPage } 
    }],
    onError: (error) => {
      console.error('Error updating department:', error);
      alert(error.message);
    }
  });

  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
    refetchQueries: [{ 
      query: GET_DEPARTMENTS, 
      variables: { page: currentPage, limit: itemsPerPage } 
    }],
    onError: (error) => {
      console.error('Error deleting department:', error);
      alert(error.message);
    }
  });

  const handleCreate = async () => {
    const filteredSubDepts = subDepartments.filter(name => name.trim() !== '');
    try {
      await createDepartment({
        variables: {
          input: {
            name: departmentName,
            subDepartments: filteredSubDepts.map(name => ({ name })),
          },
        },
      });
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error creating department:', err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedDepartment) return;
    const filteredSubDepts = subDepartments.filter(name => name.trim() !== '');
    try {
      await updateDepartment({
        variables: {
          id: selectedDepartment.id,
          input: {
            name: departmentName,
            subDepartments: filteredSubDepts.map(name => ({ name })),
          },
        },
      });
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error updating department:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDepartment({
          variables: { id },
        });
      } catch (err) {
        console.error('Error deleting department:', err);
      }
    }
  };

  const resetForm = () => {
    setDepartmentName('');
    setSubDepartments(['']);
    setSelectedDepartment(null);
  };

  const openCreateModal = () => {
    setModalMode('create');
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setModalMode('edit');
    setSelectedDepartment(department);
    setDepartmentName(department.name);
    setSubDepartments(
      department.subDepartments.length > 0
        ? department.subDepartments.map(sub => sub.name)
        : ['']
    );
    setIsModalOpen(true);
  };

  const addSubDepartment = () => {
    setSubDepartments([...subDepartments, '']);
  };

  const removeSubDepartment = (index: number) => {
    setSubDepartments(subDepartments.filter((_, i) => i !== index));
  };

  const updateSubDepartment = (index: number, value: string) => {
    const newSubDepartments = [...subDepartments];
    newSubDepartments[index] = value;
    setSubDepartments(newSubDepartments);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  const departments = data?.getDepartments.departments || [];
  const totalPages = data?.getDepartments.totalPages || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Departments
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization's departments and sub-departments
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Department
        </button>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Department Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Sub-Departments
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data?.getDepartments.departments.map((department) => (
                    <tr key={department.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {department.name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-2">
                          {department.subDepartments.map((subDept) => (
                            <span
                              key={subDept.id}
                              className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                            >
                              {subDept.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(department)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(department.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === data?.getDepartments.totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{data?.getDepartments.totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === data?.getDepartments.totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {modalMode === 'create' ? 'Create Department' : 'Edit Department'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name
                    </label>
                    <input
                      type="text"
                      id="departmentName"
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter department name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub-Departments
                    </label>
                    <div className="space-y-2">
                      {subDepartments.map((subDept, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={subDept}
                            onChange={(e) => updateSubDepartment(index, e.target.value)}
                            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Enter sub-department name"
                          />
                          {subDepartments.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSubDepartment(index)}
                              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addSubDepartment}
                      className="mt-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Sub-Department
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
                <button
                  type="button"
                  onClick={modalMode === 'create' ? handleCreate : handleUpdate}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
                >
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
