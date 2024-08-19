// import { getTalks } from "../api/talk-requests/route"
import "./page.css"

export default async function Talk() {
	// const data = await getTalks()
	return (
		<main>
			{/* Current talks: {JSON.stringify(data)} <br /> */}
			<form className="max-w-screen-md m-auto" action="/api/talk-requests" method="POST">
				<input type="text" placeholder="Speaker Name" name="speaker" />
				<input type="text" placeholder="Talk Title" name="title" />
				<textarea placeholder="Talk Description..." name="description"></textarea>
				<input className="btn hover:bg-accent hover:text-base-100" type="reset" value="Reset" />
				<button className="btn hover:bg-accent hover:text-base-100">Submit</button>
			</form>
		</main>
	)
}
