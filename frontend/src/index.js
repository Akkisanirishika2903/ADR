import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure you're using the correct import for React 18
import App from './App'; // Adjust the path if necessary

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('No root element found!');
}
