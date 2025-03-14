import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import useApiStore from './apiStore';
import { generateOpenApi } from './openapiGenerator';

const SwaggerPreview = () => {
  const { apiInfo, endpoints, schemas } = useApiStore();
  const openApiSpec = generateOpenApi(apiInfo, endpoints, schemas);

  return (
    <>
      <h3>Swagger Preview</h3>
      <SwaggerUI spec={openApiSpec} />
    </>
  );
};

export default SwaggerPreview;