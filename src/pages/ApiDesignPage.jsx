import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import SwaggerPreview from '../components/apidesign/SwaggerPreview';
import ApiForm from '../components/apidesign/ApiForm';
import ApiList from '../components/apidesign/ApiList';
import ManageIntegration from '../components/apidesign/ManageIntegration';
import EditApiPage from '../components/apidesign/EditApiPage';

const ApiDesignPage = () => {
  const [openApiSpec, setOpenApiSpec] = useState(null);
  const [apis, setApis] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [editingIntegration, setEditingIntegration] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch existing apis from Cosmos DB
    axios.get('http://localhost:3000/api/apispecs')
      .then(response => {
        if (Array.isArray(response.data)) {
          setApis(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Unexpected response format');
        }
      })
      .catch(error => {
        console.error('Error fetching APIs:', error);
        setError('Error fetching APIs');
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/api/apispecs/${id}`)
      .then(() => setApis(apis.filter(integration => integration.id !== id)))
      .catch(error => {
        console.error('Error deleting integration:', error);
        setError('Error deleting integration');
      });
  };

  const handleManage = (integration) => {
    setSelectedIntegration(integration);
    setOpenApiSpec(null); // Clear the Swagger preview when managing an integration
  };

  const handleEdit = (integration) => {
    setEditingIntegration(integration);
    setOpenApiSpec(null); // Clear the Swagger preview when editing an integration
  };

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='API Design' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {!editingIntegration && (
          <div className='mb-8'>
            <button
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              onClick={() => setIsCreating(true)}
            >
              Create API
            </button>
          </div>
        )}

        {error && (
          <div className='mb-8 text-red-600'>
            {error}
          </div>
        )}

        {isCreating && (
          <ApiForm setIsCreating={setIsCreating} setApis={setApis} apis={apis} />
        )}

        {!isCreating && !selectedIntegration && !editingIntegration && (
          <ApiList apis={apis} handleDelete={handleDelete} handleManage={handleManage} handleEdit={handleEdit} />
        )}

        {selectedIntegration && (
          <ManageIntegration integration={selectedIntegration} setOpenApiSpec={setOpenApiSpec} />
        )}

        {editingIntegration && (
          <EditApiPage integration={editingIntegration} setOpenApiSpec={setOpenApiSpec} />
        )}

        {!editingIntegration  && openApiSpec && (
          <div className='mb-8'>
            <SwaggerPreview spec={openApiSpec} />
          </div>
        )}
      </main>
    </div>
  );
};

export default ApiDesignPage;