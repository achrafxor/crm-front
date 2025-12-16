import ReactDOM from 'react-dom/client'

// Minimal test - just render text
const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(
        <div style={{ padding: '50px', fontSize: '24px', color: 'green' }}>
            <h1>REACT IS WORKING</h1>
            <p>Port: 5175</p>
            <p>Time: {new Date().toISOString()}</p>
        </div>
    );
} else {
    document.body.innerHTML = '<h1 style="color:red;">ROOT DIV NOT FOUND</h1>';
}
