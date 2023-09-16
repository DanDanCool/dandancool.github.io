import {Link} from 'react-router-dom'
function NavBar() {
	return (
	<div className="flex flex-row items-center justify-between text-2xl tracking-wide">
	  <Link to="/" className="px-10">Daniel's Blog</Link>
	  <nav>
		<ul className = "flex flex-row">
		  <li>
		  <Link to="/about" className="px-5">about</Link>
		  </li>
		  <li>
		  <a href="mailto:sun.daniel@outlook.com" className="px-5">contact</a>
		  </li>
		  <li>
		  <a href="https://github.com/DanDanCool" className="pl-5 pr-10">github</a>
		  </li>
		</ul>
	  </nav>
	</div>
	);
}

export default NavBar;
