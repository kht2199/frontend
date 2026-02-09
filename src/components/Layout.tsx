import { Link, Outlet } from "react-router";
import "./Layout.css";

export default function Layout() {
	return (
		<>
			<nav className="layout-nav">
				<Link to="/">Home</Link>
				<Link to="/about">About</Link>
			</nav>
			<main className="layout-main">
				<Outlet />
			</main>
		</>
	);
}
