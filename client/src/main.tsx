import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css';

import { HashRouter as Router } from 'react-router-dom';

import { BusProvider } from './context/BusContext.tsx'
import { SearchProvider } from './context/SearchContext.tsx'
import { BusRoutesProvider } from './context/BusRoutesContext.tsx'
import { TripProvider } from './context/TripContext.tsx'
import { FormProvider } from './context/FormContext.tsx'
import { AuthProvider } from './context/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <BusRoutesProvider>
      <FormProvider>
      <TripProvider>
      <SearchProvider>
        <BusProvider>
              <App />
        </BusProvider>
      </SearchProvider>
      </TripProvider>
      </FormProvider>
    </BusRoutesProvider>
    </AuthProvider>
  </StrictMode>,
)
