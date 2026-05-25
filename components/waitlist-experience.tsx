"use client";

import {
	ArrowRightIcon,
	BrainIcon,
	CaretDownIcon,
	CheckCircleIcon,
	HeartIcon,
	ShieldCheckIcon,
	SparkleIcon,
} from "@phosphor-icons/react";
import xior from "xior";
import {
	type SubmitEvent,
	useEffect,
	useState,
	useSyncExternalStore,
} from "react";
import { WaitlistMobileMockup } from "./waitlist-mobile-mockup";
import { WaitlistNavbar } from "./waitlist-navbar";

interface WaitlistResponse {
	message: string;
}

type FormStatus = "idle" | "loading" | "success" | "error";
type ThemeMode = "light" | "dark";

const supportPoints = [
	{
		icon: BrainIcon,
		label: "Work-aware support",
		detail: "Grounded in pressure, boundaries, and how work actually feels.",
	},
	{
		icon: HeartIcon,
		label: "Human, calm guidance",
		detail: "Gentle next steps instead of generic wellness advice.",
	},
	{
		icon: ShieldCheckIcon,
		label: "Private by design",
		detail: "Built for sensitive conversations and employee trust.",
	},
];

interface WaitlistJoinFormProps {
	buttonClassName?: string;
	className: string;
	email: string;
	id?: string;
	inputClassName?: string;
	isSubmitting: boolean;
	onEmailChange: (nextEmail: string) => void;
	onSubmit: (event: SubmitEvent<HTMLFormElement>) => void | Promise<void>;
}

function WaitlistJoinForm({
	buttonClassName,
	className,
	email,
	id = "waitlist",
	inputClassName,
	isSubmitting,
	onEmailChange,
	onSubmit,
}: WaitlistJoinFormProps) {
	return (
		<form id={id} className={className} onSubmit={onSubmit}>
			<label className="sr-only" htmlFor={`${id}-email`}>
				Email address
			</label>
			<input
				id={`${id}-email`}
				name="email"
				type="email"
				value={email}
				onChange={(event) => onEmailChange(event.target.value)}
				placeholder="you@company.com"
				autoComplete="email"
				required
				className={inputClassName}
			/>
			<button type="submit" disabled={isSubmitting} className={buttonClassName}>
				<span>{isSubmitting ? "Joining" : "Join waitlist"}</span>
				<ArrowRightIcon size={18} weight="bold" />
			</button>
		</form>
	);
}

function WaitlistStatusMessage({
	className,
	message,
	status,
}: {
	className: string;
	message: string;
	status: FormStatus;
}) {
	if (!message) {
		return null;
	}

	return (
		<p
			className={`${className} flex items-center gap-2 text-sm font-medium ${
				status === "success" ? "text-(--success)" : "text-(--error)"
			}`}
			role="status"
		>
			{status === "success" ? (
				<CheckCircleIcon size={18} weight="fill" />
			) : null}
			{message}
		</p>
	);
}

function subscribeToSystemTheme(onStoreChange: () => void) {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	mediaQuery.addEventListener("change", onStoreChange);

	return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSystemTheme(): ThemeMode {
	if (typeof window === "undefined") {
		return "light";
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function WaitlistExperience() {
	const systemTheme = useSyncExternalStore<ThemeMode>(
		subscribeToSystemTheme,
		getSystemTheme,
		() => "light",
	);
	const [themeOverride, setThemeOverride] = useState<ThemeMode | null>(null);
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<FormStatus>("idle");
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (themeOverride) {
			document.documentElement.dataset.theme = themeOverride;
			return;
		}

		delete document.documentElement.dataset.theme;
	}, [themeOverride]);

	useEffect(() => {
		if (!message) {
			return;
		}

		const timeoutId = window.setTimeout(
			() => {
				setMessage("");
				setStatus("idle");
			},
			status === "success" ? 4500 : 6500,
		);

		return () => window.clearTimeout(timeoutId);
	}, [message, status]);

	async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const trimmedEmail = email.trim().toLowerCase();
		if (!trimmedEmail) {
			setStatus("error");
			setMessage("Enter your email to join the waitlist.");
			return;
		}

		setStatus("loading");
		setMessage("");

		try {
			const { data } = await xior.post<WaitlistResponse>("/api/waitlist", {
				email: trimmedEmail,
			});

			setStatus("success");
			setMessage(data.message);
			setEmail("");
		} catch {
			setStatus("error");
			setMessage("Something went wrong. Please try again.");
		}
	}

	function toggleTheme() {
		setThemeOverride((currentTheme) => {
			const resolvedTheme = currentTheme ?? systemTheme;
			return resolvedTheme === "dark" ? "light" : "dark";
		});
	}

	const isSubmitting = status === "loading";
	const resolvedTheme = themeOverride ?? systemTheme;

	return (
		<main className="min-h-screen bg-(--page-bg) text-(--text)">
			<WaitlistNavbar
				resolvedTheme={resolvedTheme}
				onThemeToggle={toggleTheme}
			/>

			<section className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-5 pb-10 pt-6 sm:px-8 lg:hidden">
				<div className="max-w-2xl">
					<p className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--surface-soft) px-4 py-2 text-sm font-medium text-(--muted) shadow-[0_12px_30px_rgb(13_32_24_/_8%)]">
						<SparkleIcon size={16} weight="duotone" />
						Workplace mental wellness, starting soon
					</p>

					<h1 className="max-w-[11ch] text-[clamp(2.9rem,13vw,4.55rem)] leading-[0.92] font-semibold tracking-[-0.05em] text-balance">
						A calmer way to support people at work.
					</h1>

					<p className="mt-5 max-w-[26rem] text-[1.05rem] leading-[1.72] text-(--muted)">
						tranqli is being built as a mobile companion for employees who
						need practical support around work pressure, wellbeing, and the
						right next step.
					</p>
				</div>

				<div className="max-w-xl">
					<WaitlistJoinForm
						email={email}
						isSubmitting={isSubmitting}
						onEmailChange={setEmail}
						onSubmit={handleSubmit}
						id="waitlist-mobile"
						className="scroll-mt-28 rounded-[1.9rem] border border-(--line) bg-(--surface) p-2 shadow-[0_24px_80px_rgb(34_65_53_/_14%)]"
						inputClassName="waitlist-field min-h-[3.4rem] w-full rounded-[1.2rem] border-0 bg-transparent px-4 text-[1.03rem] text-(--text) outline-none placeholder:text-(--muted) [-webkit-text-fill-color:var(--text)] [caret-color:var(--text)]"
						buttonClassName="inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-[1.25rem] bg-(--brand) px-5 text-base font-bold text-(--brand-ink) shadow-[0_16px_36px_var(--brand-shadow)] transition duration-200 ease-out hover:-translate-y-px disabled:opacity-70"
					/>

					<WaitlistStatusMessage
						className="mt-3"
						message={message}
						status={status}
					/>
				</div>

				<div className="space-y-3" aria-label="tranqli support highlights">
					<p className="text-xs font-semibold tracking-[0.18em] text-(--muted) uppercase">
						What tranqli brings
					</p>

					<div className="grid gap-3">
						{supportPoints.map((point) => {
							const Icon = point.icon;

							return (
								<article
									className="flex items-start gap-4 rounded-[1.55rem] border border-(--line) bg-(--surface) px-4 py-4 shadow-[0_18px_54px_rgb(13_32_24_/_10%)]"
									key={point.label}
								>
									<div className="grid size-11 shrink-0 place-items-center rounded-[1rem] bg-[color-mix(in_srgb,var(--brand)_16%,transparent)] text-(--brand-strong)">
										<Icon size={20} weight="duotone" />
									</div>
									<div className="min-w-0">
										<h2 className="text-[1.08rem] leading-[1.2] font-semibold text-(--brand-strong)">
											{point.label}
										</h2>
										<p className="mt-1 text-[0.94rem] leading-6 text-(--muted)">
											{point.detail}
										</p>
									</div>
								</article>
							);
						})}
					</div>
				</div>
			</section>

			<section className="relative mx-auto hidden w-full max-w-7xl grid-cols-1 gap-10 px-5 pb-6 pt-8 sm:px-8 lg:grid lg:min-h-[calc(100vh-5.75rem)] lg:grid-cols-[1.02fr_0.98fr] lg:px-10">
				<div className="flex min-h-[58vh] flex-col justify-between gap-10 lg:min-h-[calc(100vh-3rem)]">
					<div className="max-w-2xl">
						<p className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--surface-soft) px-4 py-2 text-sm font-medium text-(--muted)">
							<SparkleIcon size={16} weight="duotone" />
							Workplace mental wellness, starting soon
						</p>

						<h1 className="max-w-3xl text-[clamp(3rem,8vw,7.4rem)] leading-[0.9] font-semibold tracking-normal text-balance">
							A calmer way to support people at work.
						</h1>

						<p className="mt-7 max-w-xl text-lg leading-8 text-(--muted) sm:text-xl">
							tranqli is being built as a mobile companion for employees who
							need practical support around work pressure, wellbeing, and the
							right next step.
						</p>

						<WaitlistJoinForm
							email={email}
							isSubmitting={isSubmitting}
							onEmailChange={setEmail}
							onSubmit={handleSubmit}
							className="waitlist-form mt-9 scroll-mt-28"
						/>

						<WaitlistStatusMessage
							className="mt-4"
							message={message}
							status={status}
						/>
					</div>

					<div className="grid gap-3 sm:grid-cols-3">
						{supportPoints.map((point) => {
							const Icon = point.icon;

							return (
								<div className="support-pill" key={point.label}>
									<Icon size={19} weight="duotone" />
									<span>{point.label}</span>
								</div>
							);
						})}
					</div>
				</div>

				<aside className="relative flex min-h-140 items-center justify-center lg:min-h-[calc(100vh-3rem)]">
					<div className="ambient ambient-one" />
					<div className="ambient ambient-two" />

					<WaitlistMobileMockup />
				</aside>

				<a
					className="scroll-cue"
					href="#waitlist"
					aria-label="Scroll to waitlist"
				>
					<CaretDownIcon size={17} weight="bold" />
				</a>
			</section>
		</main>
	);
}
