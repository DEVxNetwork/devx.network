export default async function TalkSubmitted() {
	return (
		<div className="min-h-screen bg-base-200 py-8">
			<div className="container mx-auto max-w-2xl px-4">
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body text-center">
						<div className="mb-6">
							<div className="text-6xl mb-4">✅</div>
							<h1 className="text-3xl font-bold mb-4">Proposal Submitted!</h1>
							<p className="text-lg text-base-content/70 mb-6">
								Thank you for submitting your talk proposal. We&apos;ve received your submission and
								will review it shortly.
							</p>
						</div>

						<div className="bg-base-200 p-4 rounded-lg mb-6">
							<h2 className="font-semibold mb-2">What happens next?</h2>
							<ul className="text-left space-y-2 text-sm">
								<li>• Our team will review your proposal</li>
								<li>• We&apos;ll contact you via email with our decision</li>
								<li>• If accepted, we&apos;ll coordinate scheduling details</li>
								<li>• Your presentation will be recorded and broadcasted</li>
							</ul>
						</div>

						<div className="flex gap-4 justify-center">
							<a href="/talk" className="btn btn-outline">
								Submit Another Proposal
							</a>
							<a href="/" className="btn btn-primary">
								Back to Home
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
