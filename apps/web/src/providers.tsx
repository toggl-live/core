"use client";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import createCache from '@emotion/cache';
import {useServerInsertedHTML} from 'next/navigation';
import {CacheProvider} from '@emotion/react';
import {ThemeProvider as MuiThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme} from '@mui/material/styles';

const theme = createTheme({
	palette: {
		mode: 'dark',
	},
});

import {useState} from "react";

type Props = {
	children?: React.ReactNode;
	options: any;
};

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export default function GlobalProvider({options, children}: Props) {
	const [{cache, flush}] = useState(() => {
		const cache = createCache(options);
		cache.compat = true;
		const prevInsert = cache.insert;
		let inserted: string[] = [];
		cache.insert = (...args) => {
			const serialized = args[1];
			if (cache.inserted[serialized.name] === undefined) {
				inserted.push(serialized.name);
			}
			return prevInsert(...args);
		};
		const flush = () => {
			const prevInserted = inserted;
			inserted = [];
			return prevInserted;
		};
		return {cache, flush};
	});

	useServerInsertedHTML(() => {
		const names = flush();
		if (names.length === 0) {
			return null;
		}
		let styles = '';
		for (const name of names) {
			styles += cache.inserted[name];
		}
		return (
			<style
				key={cache.key}
				data-emotion={`${cache.key} ${names.join(' ')}`}
				dangerouslySetInnerHTML={{
					__html: styles,
				}}
			/>
		);
	});

	return (
		<CacheProvider value={cache}>
			<MuiThemeProvider theme={theme}>
				<CssBaseline/>
				{children}
			</MuiThemeProvider>
		</CacheProvider>
	);
}
