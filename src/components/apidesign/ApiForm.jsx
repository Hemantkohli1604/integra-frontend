import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import useApiStore from '../apidesign/apiStore';
import axios from "axios";
import yaml from "yaml";

const ApiForm = ({ setIsCreating, setApis, apis }) => {
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      version: "",
      endpoints: [{ path: "", method: "get" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "endpoints",
  });
  const { addEndpoint } = useApiStore();
  const [openApiSpec, setOpenApiSpec] = useState(null);

  const onSubmit = (data) => {
    data.endpoints.forEach(addEndpoint);
    const spec = {
      openapi: "3.0.0",
      info: {
        title: data.title,
        version: data.version,
      },
      paths: data.endpoints.reduce((acc, endpoint) => {
        acc[endpoint.path] = {
          ...acc[endpoint.path],
          [endpoint.method]: {
            operationId: `${endpoint.method}${endpoint.path.replace(/\//g, "_")}`,
            summary: `${endpoint.method} ${endpoint.path}`,
            responses: {
              200: {
                description: "Successful response",
              },
            },
          },
        };
        return acc;
      }, {}),
    };

    const yamlSpec = yaml.stringify(spec);
    setOpenApiSpec(spec);
    console.log(yamlSpec);

    // Store the OpenAPI spec in Cosmos DB
    axios.post('http://localhost:3000/api/apispecs', { spec })
      .then(response => {
        setApis([...apis, response.data]);
        setIsCreating(false);
        reset();
      })
      .catch(error => console.error('Error saving integration:', error));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mb-8'>
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Title</label>
          <input
            {...register("title")}
            className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Version</label>
          <input
            {...register("version")}
            className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black'
            required
          />
        </div>
      </div>
      {fields.map((item, index) => (
        <div key={item.id} className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Path</label>
            <input
              {...register(`endpoints.${index}.path`)}
              className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Method</label>
            <select
              {...register(`endpoints.${index}.method`)}
              className='mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black'
              required
            >
              <option value="get">GET</option>
              <option value="post">POST</option>
              <option value="put">PUT</option>
              <option value="delete">DELETE</option>
            </select>
          </div>
          <div className='col-span-2 flex items-end'>
            <button
              type='button'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-4'
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type='button'
        className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        onClick={() => append({ path: "", method: "get" })}
      >
        Add Endpoint
      </button>
      <button
        type='submit'
        className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-4'
      >
        SAVE
      </button>
    </form>
  );
};

export default ApiForm;