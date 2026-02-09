import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "./App";

describe("App", () => {
	it("renders the home page by default", () => {
		render(
			<MemoryRouter>
				<App />
			</MemoryRouter>,
		);
		expect(screen.getByText("Vite + React")).toBeInTheDocument();
	});

	it("renders the about page", () => {
		render(
			<MemoryRouter initialEntries={["/about"]}>
				<App />
			</MemoryRouter>,
		);
		expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
	});
});
