import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [app, setApp] = useState('app')
	// @ts-ignore
	window['setApp'] = setApp
	return (
		// @ts-ignore
		<div>
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