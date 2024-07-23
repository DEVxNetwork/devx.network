export const OrganizerCard = ({
	organizer: { name, imageSrc, linkedIn }
}: {
	organizer: { name: string; imageSrc: string; linkedIn: string }
}) => (
	<div className="bg-gray-700 p-6 rounded-lg text-center">
		<img src={imageSrc} alt={name} className="w-40 h-40 object-cover mx-auto mb-4" />
		<h3 className="text-xl font-bold">{name}</h3>
		<a
			href={linkedIn}
			target="_blank"
			rel="noopener noreferrer"
			className="mt-2 text-lg text-blue-400 hover:underline inline-flex items-center"
		>
			<img src="/images/linkedin-logo.webp" alt="LinkedIn Logo" className="h-12 w-12 ml-2" />
		</a>
	</div>
)
