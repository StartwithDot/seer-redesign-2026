import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter-tight';
import '../../design-system/tokens.css';
import '../../design-system/components.css';
import './risk-document.css';
import { Page } from './index';

createRoot(document.getElementById('root')!).render(<React.StrictMode><Page /></React.StrictMode>);
