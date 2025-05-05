import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css'
import {junieService} from './features/ai'

// Initialize Junie at the start of the session
junieService.initialize().catch(error => {
    console.error('Failed to initialize Junie service:', error);
});

createRoot(document.getElementById("root")!).render(<App />);
