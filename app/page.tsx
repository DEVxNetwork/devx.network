export default function Home() {
	return (
		<main>
			<img className="hero h-96 object-cover" src="/images/devx-hero.jpg" alt="" />
			<div className="hero py-12">
				<div className="hero-content text-neutral-content text-center">
					<div className="max-w-md">
						<p className="mb-5" id="veg-and-intentional">
							Fostering developer community through meetups and open-source projects in California.
						</p>
						<a className="btn btn-primary" href="/join">
							Join Us
						</a>
					</div>
				</div>
			</div>
		</main>
	)
}
