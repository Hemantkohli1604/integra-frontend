import React, { useState } from 'react';
import axios from 'axios';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ManageIntegration = ({ integration, setOpenApiSpec }) => {
  const [policies, setPolicies] = useState(integration.spec.paths);

  const handlePolicyChange = (path, method, value) => {
    setPolicies({
      ...policies,
      [path]: {
        ...policies[path],
        [method]: {
          ...policies[path][method],
          policy: value,
        },
      },
    });
  };

  const handleSave = () => {
    const updatedSpec = {
      ...integration.spec,
      paths: policies,
    };

    axios.put(`http://localhost:3000/api/apispecs/${integration.id}`, { spec: updatedSpec })
      .then(response => {
        setOpenApiSpec(updatedSpec);
        alert('Policies updated successfully');
      })
      .catch(error => console.error('Error updating policies:', error));
  };

  return (
    <div className='mb-8'>
      <h2 className='text-xl font-bold mb-4'>Manage Integration: {integration.spec.info.title}</h2>
      <SwaggerUI spec={integration.spec} />
      {Object.keys(policies).map(path => (
        Object.keys(policies[path]).map(method => (
          <div key={`${path}-${method}`} className='mb-4'>
            <h3 className='text-lg font-semibold'>{method.toUpperCase()} {path}</h3>
            <div className='mb-2'>
              <strong>Description:</strong> {policies[path][method].description}
            </div>
            <div className='mb-2'>
              <strong>Request:</strong>
              {policies[path][method].parameters && policies[path][method].parameters.map((param, index) => (
                <div key={index}>
                  <strong>{param.name}:</strong> {param.description} ({param.schema.type})
                </div>
              ))}
              {policies[path][method].requestBody && (
                <div>
                  <strong>Body:</strong> {policies[path][method].requestBody.description}
                </div>
              )}
            </div>
            <div className='mb-2'>
              <strong>Responses:</strong>
              {Object.keys(policies[path][method].responses).map((status, index) => (
                <div key={index}>
                  <strong>{status}:</strong> {policies[path][method].responses[status].description}
                </div>
              ))}
            </div>
            <textarea
              className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black'
              value={policies[path][method].policy || ''}
              onChange={(e) => handlePolicyChange(path, method, e.target.value)}
              placeholder='Enter APIM Policy'
            />
          </div>
        ))
      ))}
      <button
        className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        onClick={handleSave}
      >
        Save Policies
      </button>
    </div>
  );
};

export default ManageIntegration;