import React from 'react';
import ApiForm from './components/ApiForm';
import { withAuthenticator } from '@aws-amplify/ui-react';  // Import Amplify's Authenticator

function App() {
  const handleCreateApi = (apiData) => {
    console.log('API Data:', apiData);
    // In the future, integrate this with the backend
  };

  return (
    <div className="App">
      <h1>Welcome to the API Generator</h1>
      <ApiForm onSubmit={handleCreateApi} /> {/* Pass form data submission handler */}
    </div>
  );
}

// Wrap the App component with withAuthenticator to enable authentication
export default App;
