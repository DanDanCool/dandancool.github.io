import React, { lazy, useEffect, useState, } from 'react'
import { Link, useLoaderData, Navigate } from 'react-router-dom'
import get_history from './history'

export function RecentPosts() {
	const history = get_history()

	const items = []

	for (let i = 0; i < Math.min(history.length, 6); i++) {
		const route = "/blog/" + history[i]
		const text = history[i].replace(/\_/g, " ")
		items.push((
		<div className="w-full box-border bg-gray-300 p-52 text-center" key={i}>
		<Link to={route}>{text}</Link>
		</div>
		));
	}

	return (
	  <div className="grid grid-cols-2 justify-center gap-10 px-10">
		{items}
	  </div>
	);
}

export function HistoryPosts() {
	const history = get_history();

	return (
		<div>
		{history.map((name, index) => (
			<li key={index}>
			<Link to={"/blog/" + name}>{name.replace(/\_/g, " ")}</Link>
			</li>
		))}
		</div>
	);
}

export function BlogPost() {
	const { path } = useLoaderData();
	const [html, setHtml] = useState(<div>blarg post</div>);

	const importpost = url =>
		lazy(
			() => import(`./Posts/${url}_wrapper.jsx`).catch(() => import('./Posts/null_post_wrapper'))
		);

	useEffect(() => {
		async function loadpost() {
			const Post = await importpost(path);
			const res = (<Post />);
			setHtml(res);
		}

		loadpost();
	}, [path]);

	return (
		<React.Suspense fallback="Loading post...">
		<div className="p-10">{html}</div>
		</React.Suspense>
	);
}

export function blogLoader({ params }) {
	const path = params.postId
	return { path };
}
