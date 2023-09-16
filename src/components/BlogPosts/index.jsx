import React, { lazy, useEffect, useState, } from 'react'
import { Link, useLoaderData, Navigate } from 'react-router-dom'

export function RecentPosts() {
	return (
	  <div className="grid grid-cols-2 justify-center gap-10 p-10">
		  <div className="w-full box-border bg-gray-300 p-52 text-center">
		  <Link to="/blog/test_post">test post</Link>
		  </div>
		  <div className="w-full box-border bg-gray-300 p-52 text-center">2</div>
		  <div className="w-full box-border bg-gray-300 p-52 text-center">3</div>
		  <div className="w-full box-border bg-gray-300 p-52 text-center">4</div>
		  <div className="w-full box-border bg-gray-300 p-52 text-center">5</div>
		  <div className="w-full box-border bg-gray-300 p-52 text-center">6</div>
	  </div>
	);
}

export function BlogPost() {
	const { path } = useLoaderData();
	const [html, setHtml] = useState(<div>blarg post</div>);

	const importpost = url =>
		lazy(
			() => import(`./Posts/${url}_wrapper`).catch(() => import('./Posts/null_post_wrapper'))
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
		<div className="container">{html}</div>
		</React.Suspense>
	);
}

export function blogLoader({ params }) {
	const path = params.postId
	return { path };
}
