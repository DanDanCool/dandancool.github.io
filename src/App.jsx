import { RecentPosts, HistoryPosts } from './components/BlogPosts';
import NavBar from './components/NavBar';
import { Outlet, Link } from 'react-router-dom';

export function Layout() {
	return (
	<div>
	<NavBar/>
	<Outlet/>
	</div>
	);
}

export function Home() {
	return (
    <div className="">
      <h1 className="pt-10">
          <Link to="/blog">Recent Posts</Link>
      </h1>
	  <RecentPosts/>
    </div>
	);
}

export function About() {
	return (
		<div>
		<div className="p-10 text-2xl text-left">
		<h1>
		Simplicity is elegance
		</h1>
		<img className="pr-10 float-left object-contain h-80 w-80" src="woomy2_sq.png"/>
		<p className="text-2xl text-left mb-10">
		This is my programming philosophy. Simple solutions and systems are easier to work with and reason about, improving maintainability and reducing bugs.
		This site embraces simplicity, I definitely did not decide writing css was too much work! Regardless, I think simplicity is pretty great, don't you agree?
		</p>
		<img className="pl-10 float-right object-contain h-80 w-80" src="woomy4_sq.png"/>
		<p className="text-2xl text-left mb-10">
		My name is Daniel, I am an engineering student at the University of Waterloo. I am looking for work! If you are interested in contacting me please reach out via
		email (you can access that by clicking the contact button in the navigation bar). I primarily create tools for C and C++ to streamline and simplify the development experience.
		My latest work:&nbsp;
		<a href="https://pypi.org/project/jmake/" className="underline">jmake</a>
		,&nbsp;takes advantage of the simplicity of python to replace a hodgepodge of shell scripts and CMake found in most C and C++ projects.
		</p>
		<p className="text-2xl text-left mb-10">
		Until recently, I almost exclusively programmed in C and C++, I love the low level control - it's familiar and comfortable. That all changed when I entered the&nbsp;
		<a href="https://uwaterloo.ca/centre-for-work-integrated-learning/waterloo-experience-we-accelerate" className="underline">WE Accelerate</a>
		&nbsp;program, where I was exposed to new technologies - Azure Cloud and Azure AI. During my time there, I designed and deployed a&nbsp;
		<a href="https://gist.github.com/DanDanCool/151bbdf83e4c3872e28a6255c66dd6b5" className="underline">chatbot assistant</a>
		&nbsp;on Azure Cloud using their newly added AI services. Through this experience I found that I really enjoyed AI! The next thing I accomplished was to create a basic detection&nbsp;
		<a href="https://github.com/DanDanCool/seer" className="underline">computer vision model</a>
		. It leverages Unreal Engine to automatically generate training data, removing the need for humans to manually define a bounding box.
		</p>
		<p className="text-2xl text-left mb-10">
		Still, C and C++ holds a special place in my heart. So of course my next project was written in C. This time I wanted to design logic that scales well with multiple threads.
		I adapted my preexisting code and separated them out into pure functions. This is useful as it prevents false-sharing and removes the need for synchronization. This easily allows
		for arbitrary scaling using a thread pool. For more details click&nbsp;
		<a href="https://github.com/DanDanCool/fuzzy" className="underline">here</a>. In my experience, writing C with stdlib can be very cumbersome. I have written a support library with
		common data structures to remedy this problem. It emulates generics using macros so it can be messy but I think it's better than copying and pasting around a bunch of code. Check
		out the library&nbsp;
		<a href="https://github.com/DanDanCool/jollyc" className="underline">here</a>.
		</p>
		</div>
		</div>
	);
}

export function Blog() {
	return (
		<div className="p-10">
		<h1>History</h1>
		<HistoryPosts />
		</div>
	);
}

export function NotFound() {
	return (
		<div className="p-10">
		<h1>Page Not Found</h1>
		<img className="container mx-auto h-2/4 w-2/4" src="woomy3_sq.png" />
		</div>
	);
}

