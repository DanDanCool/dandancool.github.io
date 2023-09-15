import {Link} from 'react-router-dom'
function NavBar() {
	return (
	<div className="flex flex-row items-center justify-between text-2xl tracking-wide">
	  <Link to="/" className="px-10">Daniel's Blog</Link>
	  <nav>
		<ul class = "flex flex-row">
		  <li>
		  <Link to="/about" className="p-10">about</Link>
		  </li>
		  <li>
		  <a href="mailto:sun.daniel@outlook.com" className="p-10">contact</a>
		  </li>
		  <li>
		  <a href="https://github.com/DanDanCool" className="p-10">github</a>
		  </li>
		</ul>
	  </nav>
	</div>
	);
}

export default NavBar;
