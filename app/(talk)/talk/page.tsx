export default async function Talk() {
	return (
		<div className="min-h-screen bg-base-200 py-8">
			<div className="container mx-auto max-w-2xl px-4">
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body">
						<h1 className="card-title text-3xl font-bold text-center mb-6">
							Submit a Talk Proposal
						</h1>
						<p className="text-center mb-8 text-base-content/70">
							Want to give a presentation at our events? Submit your proposal below. Presentations
							are recorded and broadcasted on our channel.
						</p>

						<form action="/api/talk-requests" method="POST" className="space-y-6">
							<div className="divider">Contact Information</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">Full Name *</span>
								</label>
								<input
									type="text"
									name="name"
									placeholder="Your full name"
									className="input input-bordered"
									required
									value="Ezekiel"
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">Email Address *</span>
								</label>
								<input
									type="email"
									name="email"
									placeholder="your.email@example.com"
									className="input input-bordered"
									required
									value="ez@ezez.win"
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">Phone Number</span>
								</label>
								<input
									type="tel"
									name="phone"
									placeholder="(optional)"
									className="input input-bordered"
									value="1234567890"
								/>
							</div>

							<div className="divider">Presentation Details</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">Presentation Title *</span>
								</label>
								<input
									type="text"
									name="title"
									placeholder="The title of your presentation"
									className="input input-bordered"
									required
									value="Ezekiel's Talk"
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">Description *</span>
								</label>
								<textarea
									name="description"
									placeholder="Describe what your presentation will cover, the key topics, and what attendees will learn..."
									className="textarea textarea-bordered h-32"
									required
									value="Ezekiel's Talk Description"
								></textarea>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">Time Slot Preference *</span>
								</label>
								<div className="flex gap-4">
									<label className="label cursor-pointer">
										<input
											type="radio"
											name="timeSlot"
											value="5"
											className="radio radio-primary"
											required
										/>
										<span className="label-text ml-2">5 minutes</span>
									</label>
									<label className="label cursor-pointer">
										<input
											type="radio"
											name="timeSlot"
											value="20"
											className="radio radio-primary"
											checked={true}
											required
										/>
										<span className="label-text ml-2">20 minutes</span>
									</label>
								</div>
							</div>

							<div className="form-control pt-6">
								<button type="submit" className="btn btn-primary btn-lg">
									Submit Proposal
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}
