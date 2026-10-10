"use client"
import styled from "styled-components"
import { PotionBackground } from "../components/PotionBackground"

// Components //

export default function Terms() {
	return (
		<>
			<BackgroundContainer>
				<PotionBackground />
			</BackgroundContainer>
			<Container>
				<ContentWrapper>
					<Title>DEVx Community Event Terms and Acknowledgments</Title>
					<LastUpdated>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</LastUpdated>

					<Section>
						<SectionTitle>1. Event Participation</SectionTitle>
						<Paragraph>
							By attending a DEVx community event, you agree to participate in a respectful and professional manner. 
							We welcome developers of all skill levels and backgrounds, and expect all attendees to treat each other 
							with kindness and respect.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>2. Code of Conduct</SectionTitle>
						<Paragraph>
							DEVx is committed to providing a harassment-free experience for everyone, regardless of gender, gender 
							identity and expression, age, sexual orientation, disability, physical appearance, body size, race, 
							ethnicity, religion (or lack thereof), or technology choices.
						</Paragraph>
						<Paragraph>
							We do not tolerate harassment of event participants in any form. Harassment includes offensive verbal 
							comments related to gender, gender identity and expression, age, sexual orientation, disability, physical 
							appearance, body size, race, ethnicity, religion, technology choices, sexual images in public spaces, 
							deliberate intimidation, stalking, following, harassing photography or recording, sustained disruption of 
							talks or other events, inappropriate physical contact, and unwelcome sexual attention.
						</Paragraph>
						<Paragraph>
							Participants asked to stop any harassing behavior are expected to comply immediately. Event organizers 
							reserve the right to remove any participant who violates this code of conduct without a refund.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>3. Event Content and Presentations</SectionTitle>
						<Paragraph>
							Presentations, talks, and other content shared at DEVx events are the intellectual property of their 
							respective creators. Attendees may not record, photograph, or distribute event content without explicit 
							permission from the presenter and event organizers.
						</Paragraph>
						<Paragraph>
							Speakers and presenters retain all rights to their content. By presenting at a DEVx event, speakers grant 
							DEVx a non-exclusive license to use their name, likeness, and presentation materials for promotional purposes 
							related to the event.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>4. Photography and Recording</SectionTitle>
						<Paragraph>
							DEVx events may be photographed or recorded. By attending, you consent to being photographed or recorded, 
							and grant DEVx permission to use your likeness in promotional materials, social media, and other 
							publications related to the event.
						</Paragraph>
						<Paragraph>
							If you do not wish to be photographed or recorded, please inform event staff upon arrival, and we will 
							make reasonable accommodations.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>5. Food and Beverages</SectionTitle>
						<Paragraph>
							Complimentary food and beverages may be provided during DEVx events. Please inform event organizers of any 
							dietary restrictions or allergies when registering or upon arrival. While we strive to accommodate dietary 
							needs, we cannot guarantee that all food items will meet specific dietary requirements.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>6. Liability and Safety</SectionTitle>
						<Paragraph>
							Attendees are responsible for their own safety and personal belongings during DEVx events. DEVx and event 
							organizers are not liable for any loss, damage, or injury that may occur during the event.
						</Paragraph>
						<Paragraph>
							If you bring a laptop or other electronic devices, please keep them secure and do not leave them unattended. 
							DEVx is not responsible for lost or stolen items.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>7. Event Cancellation and Changes</SectionTitle>
						<Paragraph>
							DEVx reserves the right to cancel, reschedule, or modify events at any time. In the event of cancellation, 
							we will make reasonable efforts to notify registered attendees and may offer refunds or credits for future 
							events, subject to our refund policy.
						</Paragraph>
						<Paragraph>
							Event details, including speakers, topics, and schedules, are subject to change without notice. We will 
							endeavor to communicate significant changes to registered attendees.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>8. Registration and Attendance</SectionTitle>
						<Paragraph>
							Registration for DEVx events may be required. We reserve the right to limit attendance and to refuse 
							registration or admission to anyone at our discretion.
						</Paragraph>
						<Paragraph>
							If you register for an event but cannot attend, please cancel your registration as soon as possible to 
							allow others on the waitlist to attend.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>9. Networking and Community</SectionTitle>
						<Paragraph>
							DEVx events are designed to foster networking and community building. We encourage attendees to connect 
							with each other, share knowledge, and collaborate on projects. However, please respect others' boundaries 
							and professional space.
						</Paragraph>
						<Paragraph>
							Solicitation, spam, or aggressive marketing at events is not permitted. If you are interested in 
							sponsoring or partnering with DEVx, please contact us through official channels.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>10. Open Source and Projects</SectionTitle>
						<Paragraph>
							DEVx supports open-source projects and community contributions. When sharing projects or code at events, 
							please respect intellectual property rights and licensing requirements. We encourage the use of open-source 
							licenses and proper attribution.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>11. Contact and Reporting</SectionTitle>
						<Paragraph>
							If you experience or witness harassment or other violations of these terms, please report it immediately 
							to event organizers or staff. All reports will be taken seriously and handled confidentially.
						</Paragraph>
						<Paragraph>
							For questions about these terms or to contact DEVx organizers, please visit our website or reach out 
							through our official communication channels.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>12. Acknowledgment</SectionTitle>
						<Paragraph>
							By attending a DEVx community event, you acknowledge that you have read, understood, and agree to be bound 
							by these terms and conditions. You also acknowledge that DEVx reserves the right to update these terms at 
							any time, and that your continued participation in events constitutes acceptance of any modifications.
						</Paragraph>
					</Section>

					<FooterNote>
						Thank you for being part of the DEVx community. We look forward to seeing you at our events!
					</FooterNote>
				</ContentWrapper>
			</Container>
		</>
	)
}

// Styled Components //

const BackgroundContainer = styled.section`
	background-color: #0a0a0a;
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
	z-index: -1;
`

const Container = styled.main`
	min-height: 100vh;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: 2rem 1rem;
	padding-top: 6rem;

	@media (max-width: 768px) {
		padding-top: 4rem;
		padding: 1.5rem 1rem;
	}
`

const ContentWrapper = styled.div`
	background-color: rgba(21, 21, 28, 0.75);
	backdrop-filter: blur(10px);
	padding: 3rem;
	border-radius: 1rem;
	width: 100%;
	max-width: 800px;
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
	color: white;

	@media (max-width: 768px) {
		padding: 2rem 1.5rem;
		max-width: 100%;
	}

	@media (max-width: 480px) {
		padding: 1.5rem 1rem;
	}
`

const Title = styled.h1`
	font-size: clamp(1.75rem, 5vw, 2.5rem);
	font-weight: 700;
	color: white;
	margin: 0 0 1rem 0;
	line-height: 1.2;
`

const LastUpdated = styled.p`
	color: rgba(255, 255, 255, 0.6);
	font-size: 0.875rem;
	margin: 0 0 2rem 0;
`

const Section = styled.section`
	margin-bottom: 2.5rem;

	&:last-of-type {
		margin-bottom: 0;
	}
`

const SectionTitle = styled.h2`
	font-size: clamp(1.25rem, 3vw, 1.5rem);
	font-weight: 600;
	color: rgba(255, 255, 255, 0.95);
	margin: 0 0 1rem 0;
	line-height: 1.3;
`

const Paragraph = styled.p`
	font-size: 1rem;
	line-height: 1.7;
	color: rgba(255, 255, 255, 0.85);
	margin: 0 0 1rem 0;

	&:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		font-size: 0.9375rem;
		line-height: 1.6;
	}
`

const FooterNote = styled.p`
	font-size: 1rem;
	line-height: 1.7;
	color: rgba(255, 255, 255, 0.9);
	margin: 2.5rem 0 0 0;
	padding-top: 2rem;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	font-style: italic;
	text-align: center;

	@media (max-width: 768px) {
		font-size: 0.9375rem;
		margin-top: 2rem;
		padding-top: 1.5rem;
	}
`
