"use client"

import { ArrowUpRight, Check, Command, ShieldCheck, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { consoleOrigin } from "../console-origin"

const SECONDS = 5

export default function MovedPage() {
	const [target, setTarget] = useState("https://console.supermemory.ai")
	const [oldHost, setOldHost] = useState("app.supermemory.ai")

	useEffect(() => {
		setTarget(consoleOrigin(window.location.hostname, window.location.protocol))
		setOldHost(window.location.hostname)
	}, [])

	useEffect(() => {
		const id = setTimeout(() => window.location.replace(target), SECONDS * 1000)
		return () => clearTimeout(id)
	}, [target])

	const newHost = target.replace(/^https?:\/\//, "")

	return (
		<div className="page">
			<header className="brand">
				<a href="https://supermemory.ai" aria-label="Supermemory home">
					<img alt="Supermemory" src="/logo-fullmark.svg" />
				</a>
				<div className="brand-meta"><span className="live-dot" />Platform update</div>
			</header>

			<main className="notice">
				<div className="notice-inner">
					<div className="eyebrow"><Sparkles aria-hidden="true" /> A better home for your memory</div>
					<h1 className="headline">Your memory,<br /><span>in one place.</span></h1>
					<p className="body">Supermemory has moved to a new home built for faster access to your memories, API keys, and connected tools.</p>

					<div className="route-card">
						<div className="route-label">You&apos;re going from</div>
						<div className="route-row"><span className="route-old">{oldHost}</span><ArrowUpRight aria-hidden="true" /></div>
						<div className="route-divider" />
						<div className="route-label">Your new destination</div>
						<div className="route-row route-destination"><span>{newHost}</span><Check aria-hidden="true" /></div>
					</div>

					<div className="action">
						<a className="button" href={target}>Open the console <ArrowUpRight aria-hidden="true" /></a>
						<div className="progress" style={{ "--seconds": `${SECONDS}s` } as React.CSSProperties} />
						<p aria-live="polite" className="status"><span className="status-key"><Command aria-hidden="true" /> K</span> Redirecting automatically</p>
					</div>
				</div>

				<aside className="assurance" aria-label="What moves with you">
					<div className="assurance-icon"><ShieldCheck aria-hidden="true" /></div>
					<div><strong>Nothing gets left behind.</strong><p>Your data and connections are ready when you arrive.</p></div>
				</aside>
			</main>
			<footer className="footer"><span>© Supermemory</span><span>Memory infrastructure for the next generation of AI</span></footer>
		</div>
	)
}
