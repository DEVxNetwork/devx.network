import { NextResponse } from "next/server"

const db = require("better-sqlite3")("./talks.db")
db.pragma("journal_mode = WAL")

db.prepare(
	`
CREATE TABLE IF NOT EXISTS Talks (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    speaker TEXT,
    title TEXT
);
`
).run()

const getTalks = async () => {
	const stmt = db.prepare("SELECT * FROM talks")
	const talks = stmt.all()
	return talks
}

export { getTalks }

export async function GET() {
	const talks = getTalks()
	return NextResponse.json({ data: talks })
}

export async function POST(req) {
	const formData = await req.formData()
	const description = formData.get("description")
	const speaker = formData.get("speaker")
	const title = formData.get("title")
	const stmt = db.prepare(`
        INSERT INTO Talks (description, speaker, title)
        VALUES (?, ?, ?)
        `)
	stmt.run(description, speaker, title)
	return NextResponse.redirect(new URL("/talk/submitted", req.url))
}
