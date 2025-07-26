export default async function Talk() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-4 sm:py-8">
			<div className="container mx-auto max-w-2xl px-3 sm:px-4">
				<div className="card bg-base-100/95 backdrop-blur-sm shadow-2xl border border-base-300/50">
					<div className="card-body p-4 sm:p-8">
						<div className="text-center mb-8">
							<div className="mb-4">
								<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-4">
									<span className="text-2xl">🎤</span>
								</div>
							</div>
							<h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
								Submit a Talk Proposal
							</h1>
							<p className="text-sm sm:text-base text-base-content/70 max-w-lg mx-auto leading-relaxed">
								Share your expertise with our community! Your presentation will be recorded and
								broadcasted to reach developers worldwide.
							</p>
						</div>

						<div className="w-full bg-base-300 rounded-full h-2 mb-8">
							<div
								className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-0"
								id="progress-bar"
							></div>
						</div>

						<form action="/api/talk-requests" method="POST" className="space-y-6" id="talk-form">
							<div className="divider divider-start">
								<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
									👤 Contact Information
								</span>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="form-control sm:col-span-2">
									<label className="label">
										<span className="label-text font-semibold flex items-center gap-2">
											<span className="text-primary">👨‍💼</span>
											Full Name *
										</span>
									</label>
									<input
										type="text"
										name="name"
										placeholder="Your full name"
										className="input input-bordered focus:input-primary transition-all duration-300 hover:shadow-md"
										required
										defaultValue=""
									/>
								</div>

								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold flex items-center gap-2">
											<span className="text-primary">📧</span>
											Email *
										</span>
									</label>
									<input
										type="email"
										name="email"
										placeholder="your.email@example.com"
										className="input input-bordered focus:input-primary transition-all duration-300 hover:shadow-md"
										required
										defaultValue=""
									/>
								</div>

								<div className="form-control">
									<label className="label">
										<span className="label-text font-semibold flex items-center gap-2">
											<span className="text-primary">📱</span>
											Phone
										</span>
									</label>
									<input
										type="tel"
										name="phone"
										placeholder="(555) 123-4567"
										className="input input-bordered focus:input-primary transition-all duration-300 hover:shadow-md"
										defaultValue=""
									/>
								</div>
							</div>

							<div className="divider divider-start">
								<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
									🎯 Presentation Details
								</span>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold flex items-center gap-2">
										<span className="text-primary">🏷️</span>
										Presentation Title *
									</span>
								</label>
								<input
									type="text"
									name="title"
									placeholder="e.g., Building Scalable React Applications"
									className="input input-bordered focus:input-primary transition-all duration-300 hover:shadow-md"
									required
									defaultValue=""
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold flex items-center gap-2">
										<span className="text-primary">📝</span>
										Description *
									</span>
								</label>
								<textarea
									name="description"
									placeholder="Describe your presentation topic, key takeaways, and what attendees will learn. Be specific about technologies, concepts, or methodologies you'll cover..."
									className="textarea textarea-bordered h-32 focus:textarea-primary transition-all duration-300 hover:shadow-md resize-none"
									required
									defaultValue=""
								></textarea>
								<label className="label">
									<span className="label-text-alt text-base-content/60">
										Tip: Include your experience level and target audience
									</span>
								</label>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold flex items-center gap-2 mb-3">
										<span className="text-primary">⏰</span>
										Time Slot Preference *
									</span>
								</label>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<label className="cursor-pointer">
										<input
											type="radio"
											name="timeSlot"
											value="5"
											className="sr-only peer"
											required
										/>
										<div className="card bg-base-200 hover:bg-primary/10 peer-checked:bg-primary peer-checked:text-primary-content transition-all duration-300 hover:shadow-md peer-checked:shadow-lg border-2 border-transparent peer-checked:border-primary">
											<div className="card-body p-4 text-center">
												<div className="text-2xl mb-2">⚡</div>
												<h3 className="font-bold">Lightning Talk</h3>
												<p className="text-sm opacity-70">5 minutes</p>
												<p className="text-xs mt-1">Quick insights & demos</p>
											</div>
										</div>
									</label>
									<label className="cursor-pointer">
										<input
											type="radio"
											name="timeSlot"
											value="20"
											className="sr-only peer"
											required
										/>
										<div className="card bg-base-200 hover:bg-primary/10 peer-checked:bg-primary peer-checked:text-primary-content transition-all duration-300 hover:shadow-md peer-checked:shadow-lg border-2 border-transparent peer-checked:border-primary">
											<div className="card-body p-4 text-center">
												<div className="text-2xl mb-2">🎯</div>
												<h3 className="font-bold">Standard Talk</h3>
												<p className="text-sm opacity-70">20 minutes</p>
												<p className="text-xs mt-1">Deep dive & examples</p>
											</div>
										</div>
									</label>
								</div>
							</div>

							<div className="form-control pt-6">
								<button
									type="submit"
									className="btn btn-primary btn-lg w-full text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
								>
									<span className="mr-2">🚀</span>
									Submit Your Proposal
									<span className="ml-2">✨</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<script
				dangerouslySetInnerHTML={{
					__html: `
					document.addEventListener('DOMContentLoaded', function() {
						const form = document.getElementById('talk-form');
						const progressBar = document.getElementById('progress-bar');
						const inputs = form.querySelectorAll('input[required], textarea[required]');
						
						function updateProgress() {
							const filledInputs = Array.from(inputs).filter(input => {
								if (input.type === 'radio') {
									return form.querySelector('input[name="' + input.name + '"]:checked');
								}
								return input.value.trim() !== '';
							});
							
							// Remove duplicates for radio buttons
							const uniqueNames = new Set();
							const uniqueFilledInputs = filledInputs.filter(input => {
								if (input.type === 'radio') {
									if (uniqueNames.has(input.name)) return false;
									uniqueNames.add(input.name);
									return true;
								}
								return true;
							});
							
							const progress = (uniqueFilledInputs.length / 5) * 100; // 5 required fields total
							progressBar.style.width = progress + '%';
						}
						
						inputs.forEach(input => {
							input.addEventListener('input', updateProgress);
							input.addEventListener('change', updateProgress);
						});
						
						// Add loading state on form submit
						form.addEventListener('submit', function(e) {
							const submitBtn = form.querySelector('button[type="submit"]');
							submitBtn.innerHTML = '<span class="loading loading-spinner loading-sm mr-2"></span>Submitting...';
							submitBtn.disabled = true;
						});
						
						// Initial progress calculation
						updateProgress();
					});
				`
				}}
			/>
		</div>
	)
}
