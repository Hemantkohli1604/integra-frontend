export const generateOpenApi = (apiInfo, endpoints, schemas) => {
    const paths = {};
  
    endpoints.forEach((ep) => {
      if (!paths[ep.path]) {
        paths[ep.path] = {};
      }
  
      paths[ep.path][ep.method.toLowerCase()] = {
        summary: ep.description,
        requestBody: ep.requestBody
          ? {
              content: {
                "application/json": {
                  schema: { $ref: `#/components/schemas/${ep.requestBody}` },
                },
              },
            }
          : undefined,
        responses: {
          "200": {
            description: "Success",
            content: ep.responseBody
              ? {
                  "application/json": {
                    schema: { $ref: `#/components/schemas/${ep.responseBody}` },
                  },
                }
              : undefined,
          },
        },
      };
    });
  
    return {
      openapi: "3.0.0",
      info: {
        title: apiInfo.title,
        version: apiInfo.version,
        description: apiInfo.description,
      },
      paths,
      components: {
        schemas,
      },
    };
  };