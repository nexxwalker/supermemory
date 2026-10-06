import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
	title: "Emberspack Brain SDK Playground",
	description: "Switch and test Emberspack Brain SDKs across languages",
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
				{children}
			</body>
		</html>
	)
}
