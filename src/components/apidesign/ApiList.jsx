import React from 'react';

const ApiList = ({ apis, handleDelete, handleManage, handleEdit }) => {
  return (
    <div className='mb-8'>
      <h2 className='text-xl font-bold mb-4'>Existing API'S</h2>
      <ul>
        {apis.map(api => (
          <li key={api.id} className='mb-4'>
            <div className='flex justify-between items-center'>
              <div>
                <h3
                  className='text-lg font-semibold cursor-pointer text-blue-500 hover:underline'
                  onClick={() => handleEdit(api)}
                >
                  {api.spec.info.title}
                </h3>
                <p className='text-sm text-gray-600'>Version: {api.spec.info.version}</p>
              </div>
              <div>
                <button
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-2'
                  onClick={() => handleDelete(api.id)}
                >
                  Delete
                </button>
                <button
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  onClick={() => handleManage(api)}
                >
                  Manage
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApiList;