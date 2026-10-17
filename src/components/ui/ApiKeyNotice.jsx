export default function ApiKeyNotice() {
	return (
		<div className="page-shell flex min-h-[70vh] flex-1 items-center justify-center py-24">
			<div className="w-full max-w-xl rounded-2xl border border-line bg-elevated p-8 md:p-10">
				<p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
					Setup required
				</p>
				<h1 className="mt-3 font-display text-2xl leading-tight md:text-3xl">
					Add your API credentials to load the catalogue.
				</h1>
				<p className="mt-4 text-sm leading-relaxed text-muted">
					Every title, poster and rating is fetched live.
					Until credentials are set, this screen is all you&apos;ll see.
				</p>
				<ol className="mt-6 space-y-3 text-sm text-muted">
					<li className="flex gap-3">
						<span className="font-mono text-accent">01</span>
						<span>Get your API credentials from your catalogue data provider.</span>
					</li>
					<li className="flex gap-3">
						<span className="font-mono text-accent">02</span>
						<span>
								Copy{" "}
								<code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-ink">
									.env.example
								</code>{" "}
								to{" "}
								<code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-ink">
									.env.local
								</code>{" "}
								and fill in the values.
						</span>
					</li>
					<li className="flex gap-3">
						<span className="font-mono text-accent">03</span>
						<span>Restart the server. The catalogue loads from there.</span>
					</li>
				</ol>
			</div>
		</div>
	);
}
