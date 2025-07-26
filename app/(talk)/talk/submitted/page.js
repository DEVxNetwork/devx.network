export default async function TalkSubmitted() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-success/10 via-base-200 to-primary/5 py-4 sm:py-8">
			<div className="container mx-auto max-w-2xl px-3 sm:px-4">
				<div className="card bg-base-100/95 backdrop-blur-sm shadow-2xl border border-base-300/50">
					<div className="card-body p-4 sm:p-8 text-center">
						<div className="mb-8 animate-fadeIn">
							<div className="relative mb-6">
								<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-success to-primary rounded-full mb-4 animate-bounce">
									<span className="text-3xl">🎉</span>
								</div>
								<div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full animate-ping"></div>
								<div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
							</div>
							<h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent mb-4">
								Proposal Submitted!
							</h1>
							<p className="text-base sm:text-lg text-base-content/70 max-w-lg mx-auto leading-relaxed">
								🚀 Thank you for submitting your talk proposal! We&apos;ve received your submission
								and are excited to review it.
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
							<div className="bg-gradient-to-br from-success/10 to-success/5 p-4 rounded-xl border border-success/20">
								<div className="text-2xl mb-2">📧</div>
								<h3 className="font-semibold text-success mb-1">Confirmation Sent</h3>
								<p className="text-xs text-base-content/70">Check your email for details</p>
							</div>
							<div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20">
								<div className="text-2xl mb-2">⏱️</div>
								<h3 className="font-semibold text-primary mb-1">Review Process</h3>
								<p className="text-xs text-base-content/70">We&apos;ll respond within 5-7 days</p>
							</div>
						</div>

						<div className="bg-gradient-to-r from-base-200/50 to-base-300/30 p-6 rounded-2xl mb-8 backdrop-blur-sm border border-base-300/50">
							<h2 className="font-bold mb-4 flex items-center justify-center gap-2">
								<span className="text-primary">🔄</span>
								What happens next?
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
										1
									</div>
									<div className="text-left">
										<div className="font-semibold">Team Review</div>
										<div className="text-base-content/60">Our team evaluates your proposal</div>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
										2
									</div>
									<div className="text-left">
										<div className="font-semibold">Email Response</div>
										<div className="text-base-content/60">
											We&apos;ll contact you with our decision
										</div>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
										3
									</div>
									<div className="text-left">
										<div className="font-semibold">Scheduling</div>
										<div className="text-base-content/60">
											If accepted, we&apos;ll coordinate details
										</div>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
										4
									</div>
									<div className="text-left">
										<div className="font-semibold">Go Live!</div>
										<div className="text-base-content/60">
											Your talk will be recorded & broadcast
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<a
								href="/talk"
								className="btn btn-outline hover:scale-105 transition-transform duration-200"
							>
								<span className="mr-2">➕</span>
								Submit Another Proposal
							</a>
							<a
								href="/"
								className="btn btn-primary bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 hover:scale-105 transition-all duration-200"
							>
								<span className="mr-2">🏠</span>
								Back to Home
							</a>
						</div>
					</div>
				</div>
			</div>

			<style
				dangerouslySetInnerHTML={{
					__html: `
					@keyframes fadeIn {
						from { opacity: 0; transform: translateY(20px); }
						to { opacity: 1; transform: translateY(0); }
					}
					.animate-fadeIn {
						animation: fadeIn 0.6s ease-out;
					}
				`
				}}
			/>
		</div>
	)
}
