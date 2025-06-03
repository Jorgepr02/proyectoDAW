import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import './App.css';
import AppRoutes from './routes/AppRoutes';

export const cld = new Cloudinary({
  cloud: {
    cloudName: 'dluvwj5lo'
  }
});

function App() {
  return <AppRoutes />;
}

export default App;