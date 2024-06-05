import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
	const [num, setApp] = useState(1)
	const arr =
		// @ts-ignore
		num % 2 === 0
			// @ts-ignore
			? [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>]
			// @ts-ignore
			: [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];
	return (
		// @ts-ignore
		// <div onClick={() => setApp(app + 1)}>
		// 	{/* @ts-ignore */}
		// 	{app === 'cc' ? <Child /> : app}
		// </div>

		<ul onClickCapture={() => setApp(num + 1)}>{arr}</ul>
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