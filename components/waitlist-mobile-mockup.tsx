import { CheckCircleIcon, HeartIcon } from "@phosphor-icons/react";

const appMoments = [
	"Quick emotional check-in",
	"Work-life pressure mapping",
	"Coach or clinician next step",
];

export function WaitlistMobileMockup() {
	return (
		<div className="phone-shell" aria-label="tranqli app preview">
			<div className="phone-top">
				<span>9:41</span>
				<span className="phone-speaker" />
			</div>

			<div className="check-card">
				<p>Today</p>
				<h2>How is work feeling?</h2>
				<div className="mood-grid">
					<span>Clear</span>
					<span className="active">Heavy</span>
					<span>Restless</span>
					<span>Okay</span>
				</div>
			</div>

			<div className="soft-panel">
				<div>
					<p className="panel-kicker">Suggested next step</p>
					<h3>Talk through the pressure before it builds.</h3>
				</div>
				<HeartIcon size={30} weight="duotone" />
			</div>

			<div className="moment-list">
				{appMoments.map((moment) => (
					<div className="moment-row" key={moment}>
						<CheckCircleIcon size={18} weight="fill" />
						<span>{moment}</span>
					</div>
				))}
			</div>
		</div>
	);
}
