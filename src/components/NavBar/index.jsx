function NavBar() {
	return (
	<div className="flex flex-row items-center justify-between text-2xl">
	  <a href="/" className="px-5">Daniel's Blog</a>
	  <nav>
		  <a href="/about" className="p-5">about</a>|
		  <a href="mailto:sun.daniel@outlook.com" className="p-5">contact</a>|
		  <a href="https://github.com/DanDanCool" className="p-5">github</a>
	  </nav>
	</div>
	);
}

export default NavBar;
