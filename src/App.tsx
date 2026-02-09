import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";

export default function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<HomePage />} />
				<Route path="about" element={<AboutPage />} />
			</Route>
		</Routes>
	);
}
