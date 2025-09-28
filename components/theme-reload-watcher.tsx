'use client';

import { useEffect, useRef } from 'react';

export default function ThemeReloadWatcher() {
	const lastIsDark = useRef<boolean | null>(null);
	const ignoreFirstMutation = useRef(true);

	useEffect(() => {
		const root = document.documentElement;

		const compute = () => root.classList.contains('dark');
		lastIsDark.current = compute();

		const reload = () => {
			setTimeout(() => {
				window.location.reload();
			}, 10);
		};

		const observer = new MutationObserver(() => {
			const nowIsDark = compute();

			if (lastIsDark.current === null) {
				lastIsDark.current = nowIsDark;
				return;
			}

			if (ignoreFirstMutation.current) {
				ignoreFirstMutation.current = false;
				lastIsDark.current = nowIsDark;
				return;
			}

			if (nowIsDark !== lastIsDark.current) {
				lastIsDark.current = nowIsDark;
				reload();
			}
		});

		observer.observe(root, { attributes: true, attributeFilter: ['class'] });

		return () => observer.disconnect();
	}, []);

	return null;
}
