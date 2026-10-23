import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter-tight';
import { Page } from '../index';

const root = document.getElementById('root');
if (!root) throw new Error('Missing QA root');
createRoot(root).render(<Page />);
