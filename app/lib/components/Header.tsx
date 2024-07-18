const Header = () => {
	return (
		<header>
			<nav className="navbar bg-base-100">
				<div className="navbar-start">
					<div className="dropdown">
						<div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M4 6h16M4 12h8m-8 6h16"
								/>
							</svg>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
						>
							<li>
								<a href="/">Home</a>
							</li>
							<li>
								<a href="/about">About</a>
							</li>
							<li>
								<a href="/join">Join</a>
							</li>
							<li>
								<a href="/talk">Talk</a>
							</li>
						</ul>
					</div>
					<a className="btn btn-ghost inline p-0" href="/">
						<img src="/images/logo.jpeg" alt="SD DEVx logo" className="w-12 rounded" />
					</a>
				</div>
				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal px-1">
						<li>
							<a href="/">Home</a>
						</li>
						<li>
							<a href="/about">About</a>
						</li>
						<li>
							<a href="/join">Join</a>
						</li>
						<li>
							<a href="/talk">Talk</a>
						</li>
					</ul>
				</div>
				<div className="navbar-end">
					<a className="btn" href="/join">
						Join Us
					</a>
				</div>
			</nav>
		</header>
	)
}

export default Header
