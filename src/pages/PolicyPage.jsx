import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Header from '../components/common/Header';
import PolicyApiList from '../components/policydesign/PolicyApiList';
import PolicyFlow from '../components/policydesign/PolicyFlow';

const PolicyPage = () => {
  const [apis, setApis] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of APIs from the backend
    axios.get('http://localhost:3000/api/apispecs')
      .then(response => {
        setApis(response.data);
      })
      .catch(error => {
        console.error('Error fetching APIs:', error);
        setError('Error fetching APIs');
      });
  }, []);

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Policy Management' />
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <button
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mb-4'
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        {error && <div className='text-red-600 mb-4'>{error}</div>}
        <Routes>
          <Route path="/" element={<PolicyApiList apis={apis} />} />
          <Route path=":apiId" element={<PolicyFlow />} />
        </Routes>
      </main>
    </div>
  );
};

export default PolicyPage;