import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


// Use named import for Amplify
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';  // AWS Amplify configuration

// Import ThemeProvider for UI components
import { ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';  // Include Amplify UI styles

import App from './App';  // Main App component

// Configure Amplify with the settings from aws-exports.js
Amplify.configure(awsconfig);

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
