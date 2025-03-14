import React, { useState, useEffect } from 'react';
import axios from 'axios';
import yaml from 'yaml';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import CodeMirror from '@uiw/react-codemirror';
import {  langs } from '@uiw/codemirror-extensions-langs';
import { useNavigate  } from 'react-router-dom';


const EditApiPage = ({ integration, setOpenApiSpec }) => {
  const [spec, setSpec] = useState(yaml.stringify(integration.spec, null, 2));
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    setSpec(yaml.stringify(integration.spec, null, 2));
  }, [integration]);

  const handleSave = () => {
    try {
      const parsedSpec = yaml.parse(spec);
      axios.put(`http://localhost:3000/api/apispecs/${integration.id}`, { spec: parsedSpec })
        .then(response => {
          setOpenApiSpec(parsedSpec);
          console.log('API spec updated successfully:', spec);
          alert('API spec updated successfully');
        })
        .catch(error => console.error('Error updating API spec:', error));
    } catch (error) {
      console.error('Error parsing YAML:', error);
      alert('Error parsing YAML. Please check the syntax.');
    }
  };

  const handleChange = (value) => {
    try {
      yaml.parse(value);
      setSpec(value);
      setError(null);
    } catch (e) {
      setError('Invalid YAML syntax');
    }
  };

  function refreshPage(){ 
    window.location.reload(); 
  }

  return (
    <div className='mb-8'>
      <h2 className='text-xl font-bold mb-4'>Edit API: {integration.spec.info.title}</h2>
      <button
        className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mb-4'
        //onClick={() => navigate("/api-design")}
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <div className='flex'>
        <div className='w-1/2 pr-4'>
          <CodeMirror
            value={spec}
            extensions={[langs.yaml()]}
            theme='dark'
            onChange={(value, viewUpdate) => {
              handleChange(value);
            }}
          />
          {error && <div className='text-red-600 mt-2'>{error}</div>}
          <button
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4'
            onClick={handleSave}
          >
            Save
          </button>
        </div>
        <div className='w-1/2 pl-4'>
          <SwaggerUI spec={yaml.parse(spec)} />
        </div>
      </div>
    </div>
  );
};

export default EditApiPage;