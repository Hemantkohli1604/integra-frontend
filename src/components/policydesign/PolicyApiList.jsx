import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PolicyApiList = ({ apis }) => {
  const navigate = useNavigate();

  const handleApiClick = (api) => {
    navigate(`/policy-management/${api.id}`);
  };

  return (
    <div className='mb-8'>
      <h2 className='text-xl font-bold mb-4'>API LIST</h2>
      <ul>
        {apis.map(api => (
          <li key={api.id} className='mb-4'>
            <div className='flex justify-between items-center'>
              <div>
                <h3
                  className='text-lg font-semibold cursor-pointer text-blue-500 hover:underline'
                  onClick={() => handleApiClick(api)}
                >
                  {api.spec.info.title}
                </h3>
                <p className='text-sm text-gray-600'>Version: {api.spec.info.version}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PolicyApiList;