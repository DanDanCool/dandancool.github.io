import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Layout, Home, About, Blog, NotFound } from './App';
import reportWebVitals from './reportWebVitals';
import {createHashRouter, createRoutesFromElements, RouterProvider, Route} from 'react-router-dom';
import { BlogPost, blogLoader } from './components/BlogPosts';

const router = createHashRouter(
	createRoutesFromElements(
	  <Route path="/" element={<Layout />} >
		  <Route index element={<Home />} />
		  <Route path="about" element={<About />} />
		  <Route path="blog" element={<Blog />} />
		  <Route path="blog/:postId" element={<BlogPost />} loader={blogLoader} />
		  <Route path="*" element={<NotFound />} />
	  </Route>
	)
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
	<RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
