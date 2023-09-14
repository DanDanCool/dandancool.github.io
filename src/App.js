import BlogPosts from './components/BlogPosts';
import NavBar from './components/NavBar';
import { Routes, Route, Outlet, Link } from 'react-router-dom';

function App() {
  return (
	<div>
	<Routes>
	  <Route path="/" element={<Layout />} >
	  <Route index element={<Home />} />
	  <Route path="about" element={<About />} />
	  <Route path="*" element={<NotFound />} />
	  </Route>
	</Routes>
	</div>
  );
}

export default App;

function Layout() {
	return (
	<div>
	<NavBar/>
	<Outlet/>
	</div>
	);
}

function Home() {
	return (
    <div className="">
      <header className="text-4xl p-5 text-center">
          Recent Posts
      </header>
	  <BlogPosts/>
    </div>
	);
}

function About() {
	return (
		<div>
		About Me
		</div>
	);
}

function NotFound() {
	return (
		<div>
		404 Not Found
		</div>
	);
}
