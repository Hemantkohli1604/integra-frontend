import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';

import axios from 'axios';
import { useParams } from 'react-router-dom';

const PolicyFlow = () => {
  const { apiId } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // Fetch the API details from the backend
    axios.get(`http://localhost:3000/api/apispecs/${apiId}`)
      .then(response => {
        const apiData = response.data;
        const apiNode = {
          id: `api-${apiData.id}`,
          type: 'default',
          data: { label: apiData.spec.info.title },
          position: { x: 250, y: 5 },
        };

        const operationNodes = Object.entries(apiData.spec.paths).flatMap(([path, operations], index) =>
          Object.entries(operations).map(([method, operation], opIndex) => ({
            id: `operation-${operation.operationId}`,
            type: 'default',
            data: { label: `${method.toUpperCase()} ${path}` },
            position: { x: 250, y: 100 + (index * 100) + (opIndex * 50) },
            parentNode: `api-${apiData.id}`,
            extent: 'parent',
          }))
        );

        const edges = operationNodes.map(operationNode => ({
          id: `e-${operationNode.id}`,
          source: `api-${apiData.id}`,
          target: operationNode.id,
          type: 'smoothstep',
        }));

        setNodes([apiNode, ...operationNodes]);
        setEdges(edges);
      })
      .catch(error => {
        console.error('Error fetching API:', error);
      });
  }, [apiId, setNodes, setEdges]);

  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, [setEdges]);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        className="bg-teal-500"
        fitView
      >
        <MiniMap />
        <Controls />
        {/* <Background color='#E6E6E6' /> */}
      </ReactFlow>
    </div>
  );
};

export default PolicyFlow;