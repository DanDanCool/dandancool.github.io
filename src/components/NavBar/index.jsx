import {Link} from 'react-router-dom'
function NavBar() {
	return (
	<div className="flex flex-row items-center justify-between text-2xl">
	  <Link to="/" className="px-5">Daniel's Blog</Link>
	  <nav>
		<ul class = "flex flex-row">
		  <li>
		  <Link to="/about" className="p-5">about</Link>
		  </li>
		  <li>
		  <a href="mailto:sun.daniel@outlook.com" className="p-5">contact</a>
		  </li>
		  <li>
		  <a href="https://github.com/DanDanCool" className="p-5">github</a>
		  </li>
		</ul>
	  </nav>
	</div>
	);
}

export default NavBar;
