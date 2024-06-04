import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	return (
		<div>
			<Child />
		</div>
	);
}

function Child() {
	return <span>custom-react</span>;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// @ts-ignore
	<App name='app' />
);