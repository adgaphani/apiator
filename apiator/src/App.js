import React, { useEffect, useState } from 'react';
import ApiForm from './components/ApiForm';
import { Auth } from 'aws-amplify'; // Import Amplify's Auth module
import { withAuthenticator } from '@aws-amplify/ui-react';  // Import Amplify's Authenticator
import '@aws-amplify/ui-react/styles.css';  // Include Amplify UI styles

function App() {
  const [apis, setApis] = useState([]);  // State to hold the list of APIs
  const [loading, setLoading] = useState(true); // Loading state to track API fetch status

  // Function to fetch the list of APIs after creation
  const fetchApis = async () => {
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken(); // Get the token
      const response = await fetch('<Your_API_ENDPOINT>/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Include the token in the request header
        }
      });
      
      if (response.ok) {
        const apiList = await response.json();
        setApis(apiList); // Update the state with the fetched APIs
      } else {
        console.error('Failed to fetch APIs:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching APIs:', error);
    } finally {
      setLoading(false);  // Stop loading after the fetch
    }
  };

  useEffect(() => {
    // Fetch the APIs when the component mounts
    fetchApis();
  }, []);

  const handleCreateApi = async (apiData) => {
    console.log('API Data:', apiData);
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken(); // Get the token
      const response = await fetch('<Your_API_ENDPOINT>', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Include the token in the request header
        },
        body: JSON.stringify(apiData)
      });

      if (response.ok) {
        const createdApi = await response.json();
        console.log('API created successfully:', createdApi);

        // Now fetch and update the list of APIs after creation
        fetchApis();
      } else {
        console.error('Failed to create API:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating API:', error);
    }
  };

  return (
    <div className="App">
      <h1>Welcome to the API Generator</h1>
      <ApiForm onSubmit={handleCreateApi} /> {/* Pass form data submission handler */}
      <h2>Your APIs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {apis.map((api) => (
            <li key={api.apiId}>{api.apiName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Wrap the App component with withAuthenticator to enable authentication
export default withAuthenticator(App);
