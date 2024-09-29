// src/components/ApiForm.js
import React, { useState } from 'react';

function ApiForm({ onSubmit }) {
  const [apiName, setApiName] = useState('');
  const [method, setMethod] = useState('GET');
  const [payload, setPayload] = useState('');
  const [responseModel, setResponseModel] = useState('');
  const [responseItems, setResponseItems] = useState(1); // Default to 1 item
  const [loading, setLoading] = useState(false);  // Loading state
  const [success, setSuccess] = useState(false);  // Success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    const apiData = {
      apiName,
      method,
      payload,
      responseModel,
      responseItems: Number(responseItems),  // Ensure it's a number
    };

    try {
      // Make a POST request to the backend (replace the URL with your actual backend endpoint)
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        setSuccess(true);  // Show success message
        console.log('API created successfully');
      } else {
        console.error('Failed to create API');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create a New API</h2>
      {success && <div className="alert alert-success">API created successfully!</div>}
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label htmlFor="apiName" className="form-label">API Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="apiName" 
            value={apiName} 
            onChange={(e) => setApiName(e.target.value)} 
            required 
            placeholder="Enter API Name"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="method" className="form-label">HTTP Method</label>
          <select 
            className="form-select" 
            id="method" 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="payload" className="form-label">Payload (for POST/PUT)</label>
          <textarea 
            className="form-control" 
            id="payload" 
            value={payload} 
            onChange={(e) => setPayload(e.target.value)} 
            rows="4" 
            placeholder='{"key": "value"}'
          />
        </div>

        <div className="mb-3">
          <label htmlFor="responseModel" className="form-label">Response Model (JSON format)</label>
          <textarea 
            className="form-control" 
            id="responseModel" 
            value={responseModel} 
            onChange={(e) => setResponseModel(e.target.value)} 
            rows="4" 
            required 
            placeholder='{"id": 1, "name": "Sample"}'
          />
        </div>

        <div className="mb-3">
          <label htmlFor="responseItems" className="form-label">Number of Response Items</label>
          <input 
            type="number" 
            className="form-control" 
            id="responseItems" 
            value={responseItems} 
            onChange={(e) => setResponseItems(e.target.value)} 
            min="1" 
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Creating API...' : 'Create API'}
        </button>
      </form>
    </div>
  );
}

export default ApiForm;
