import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [app, setApp] = useState(1)
	// @ts-ignore
	return (
		// @ts-ignore
		<div onClick={() => setApp(app + 1)}>
			{/* @ts-ignore */}
			{app === 'cc' ? <Child /> : app}
		</div>
	);
}

function Child() {
	const [child, setChild] = useState('child')
	// @ts-ignore
	return <span>custom-react</span>;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// @ts-ignore
	<App name='app' />
);