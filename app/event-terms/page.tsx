"use client"
import styled from "styled-components"
import { PotionBackground } from "@/app/components/PotionBackground"
import { ErrorBoundary } from "@/app/components/ErrorBoundary"

export default function EventTerms() {
	return (
		<>
			<BackgroundContainer>
				<ErrorBoundary
					fallback={<div style={{ backgroundColor: "black", width: "100%", height: "100%" }} />}
				>
					<PotionBackground />
				</ErrorBoundary>
			</BackgroundContainer>
			<Main>
				<TermsSection>
					<header>
						<Title>DEVx Event Terms and Conditions</Title>
						<IntroText>
							Thank you for your interest in attending a DEVx event. Before completing your
							registration, please read these terms to understand the nature of the event and
							expectations for all participants. We look forward to seeing you at our next meetup.
						</IntroText>
					</header>

					<Section>
						<SectionTitle>Nature of Event</SectionTitle>
						<Paragraph>
							DEVx events are community-organized meetups hosted by volunteer organizers. These
							events are designed to foster a fun and educational environment for developers of all
							skill levels. DEVx organizers arrange venues, coordinate presentations, and facilitate
							networking opportunities, but do not control all aspects of the venue or guarantee
							specific outcomes from attendance.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>General Acknowledgments</SectionTitle>
						<Paragraph>By registering for this event, you acknowledge and agree that:</Paragraph>
						<List>
							<ListItem>You are 18+ years old or have parental/guardian consent to attend</ListItem>
							<ListItem>You voluntarily assume all risks associated with attendance</ListItem>
							<ListItem>You have read and understood these terms</ListItem>
							<ListItem>This is a community-organized event run by volunteers</ListItem>
							<ListItem>The event may be cancelled or modified without notice</ListItem>
							<ListItem>
								You are responsible for any costs incurred (travel, accommodation, etc.) related to
								event changes
							</ListItem>
						</List>
					</Section>

					<Section>
						<SectionTitle>Photography and Recording</SectionTitle>
						<Paragraph>
							Events may be photographed and/or recorded. These materials may capture your name,
							voice, image, or likeness. By attending, you grant permission for your image to be
							used in photos, videos, and other media for marketing and promotional purposes. DEVx,
							reserves the right to distribute all content and materials captured or produced during
							the events.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>Code of Conduct</SectionTitle>
						<Paragraph>
							Professional, respectful conduct is expected from all attendees. Harassment,
							discrimination, or disruptive behavior will result in removal from the event. You
							agree to comply with all venue rules and event organizer instructions.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>Venue Terms</SectionTitle>
						<Paragraph>
							The event venue may have additional terms, conditions, and rules that apply to your
							attendance. By attending, you agree to comply with all venue requirements.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>Minors</SectionTitle>
						<Paragraph>
							Individuals under 18 years of age must be accompanied by a parent or legal guardian at
							all times during the event. Attendees may be required to provide proof of age upon
							request.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>Assumption of Risk and Release</SectionTitle>
						<Paragraph>
							You assume all risks and accept sole responsibility for any injury (including, but not
							limited to, personal injury, disability, and death), illness, damage, loss, claim,
							liability, or expense, of any kind, that you may experience or incur in connection
							with attending the event.
						</Paragraph>
						<Paragraph>
							You hereby release, covenant not to sue, discharge, and hold harmless DEVx, its
							organizers, volunteers, representatives, and the venue owner, of and from any such
							claims, including all liabilities, claims, actions, damages, costs, or expenses of any
							kind arising out of or relating thereto.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>Health Considerations</SectionTitle>
						<Paragraph>
							You acknowledge the risk of exposure to communicable diseases, including COVID-19, and
							voluntarily assume the risk of exposure or infection by attending the event, and that
							such exposure or infection may result in personal injury, illness, disability, and/or
							death. You understand that the risk of becoming exposed to or infected at the event
							may result from the actions, omissions, or negligence of others who may attend the
							event.
						</Paragraph>
						<Paragraph>
							Accordingly, you understand and agree that this release includes any claims based on
							the actions, omissions, or negligence of DEVx, its organizers, volunteers, and
							representatives, whether an infection or injury occurs before, during, or after
							participation in the event.
						</Paragraph>
						<Paragraph>
							You agree to comply with all health and safety procedures that may be implemented by
							the event organizer or venue, in order to protect the health and safety of all event
							attendees.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>Data Collection</SectionTitle>
						<Paragraph>
							By registering, you provide certain personal information for event coordination
							purposes. You may optionally consent to receive additional communications.
						</Paragraph>
					</Section>

					<Section>
						<SectionTitle>Governing Law and Disputes</SectionTitle>
						<Paragraph>
							These terms are governed by the laws of the State of California. Any dispute arising
							out of or relating to your attendance at the event shall be resolved in the state or
							federal courts located in San Diego County, California. You and DEVx agree to submit
							to the personal jurisdiction of such courts. You agree to bring any dispute in your
							individual capacity, and not as a plaintiff or class member in any purported class,
							collective, or representative proceeding.
						</Paragraph>
					</Section>
				</TermsSection>
			</Main>
		</>
	)
}

const BackgroundContainer = styled.section`
	background-color: #0a0a0a;
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const Main = styled.main`
	position: relative;
	z-index: 1;
	color: white;
`

const TermsSection = styled.section`
	max-width: 900px;
	margin: 0 auto;
	padding: 8rem 2rem 4rem;

	@media (max-width: 768px) {
		padding: 6rem 1.5rem 3rem;
	}

	@media (max-width: 480px) {
		padding: 5rem 1rem 2rem;
	}
`

const Title = styled.h1`
	font-size: clamp(1.75rem, 5vw, 2.5rem);
	font-weight: 700;
	margin-bottom: 1.5rem;
	text-align: center;
	color: white;
`

const IntroText = styled.p`
	font-size: 1.125rem;
	line-height: 1.7;
	text-align: center;
	margin-bottom: 3rem;
	color: rgba(255, 255, 255, 0.85);

	@media (max-width: 768px) {
		font-size: 1rem;
		margin-bottom: 2.5rem;
	}
`

const Section = styled.section`
	margin-bottom: 2.5rem;
`

const SectionTitle = styled.h2`
	font-size: 1.5rem;
	font-weight: 600;
	margin-bottom: 1rem;
	color: white;

	@media (max-width: 768px) {
		font-size: 1.375rem;
	}
`

const Paragraph = styled.p`
	font-size: 1.0625rem;
	line-height: 1.8;
	margin-bottom: 1rem;
	color: rgba(255, 255, 255, 0.8);

	&:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		font-size: 1rem;
		line-height: 1.7;
	}
`

const List = styled.ul`
	margin: 1rem 0 0 1.5rem;
	color: rgba(255, 255, 255, 0.8);
`

const ListItem = styled.li`
	font-size: 1.0625rem;
	line-height: 1.8;
	margin-bottom: 0.5rem;

	&:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		font-size: 1rem;
		line-height: 1.7;
	}
`
