export default function Join() {
	return (
		<main>
			<section className="bg-gray-800 p-8 rounded-lg shadow-md mb-12">
				<h2 className="text-3xl font-bold mb-4 text-center">Current Events</h2>
				<div className="w-full flex flex-col items-center">
					<p className="mt-2  text-xl text-center max-w-screen-lg mb-12">
						Stay updated with our latest events, workshops, and meetups. Join us to network and
						learn with fellow developers.
					</p>
					<div className="flex justify-center gap-6 w-full">
						<div
							className="flex flex-col items-center flex-1 "
							style={{ flexBasis: "50%", height: "600px", overflow: "hidden" }}
						>
							<h2 className="text-3xl font-bold mb-4 text-center ">On Lu.ma</h2>
							<iframe
								src="https://lu.ma/embed/event/evt-UDB2YUh2bKH152P/simple"
								width="100%"
								height="100%"
								allowFullScreen
								aria-hidden="false"
							></iframe>
						</div>
						<div
							className="flex flex-col items-center flex-1"
							style={{ flexBasis: "50%", height: "600px", overflow: "hidden" }}
						>
							<h2 className="text-3xl font-bold mb-4 text-center">On Meetup.com</h2>
							<a href="https://www.meetup.com/san-diego-devx/events/301885439/?utm_medium=referral&utm_campaign=share-btn_savedevents_share_modal&utm_source=link">
								<img
									src="https://secure.meetupstatic.com/photos/event/5/0/b/c/600_519680668.webp?w=384"
									alt="Meetup Event"
									style={{
										width: "100%",
										height: "600px",
										objectFit: "cover"
									}}
								/>
							</a>
						</div>
					</div>
				</div>
				<h2 className="mt-12 text-3xl font-bold mb-4 text-center">Join Our Discord</h2>
				<div className="w-full flex flex-col items-center">
					<div className="flex justify-center">
						<a
							href="https://discord.gg/rmbT75CB"
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn-primary"
							style={{
								backgroundColor: "#5865F2",
								color: "white",
								padding: "15px 20px",
								borderRadius: "1px",
								textDecoration: "none",
								display: "inline-block"
							}}
						>
							DEVx Discord
						</a>
					</div>
				</div>
			</section>
		</main>
	)
}
