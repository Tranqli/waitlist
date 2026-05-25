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
	},
	{
		icon: HeartIcon,
		label: "Human, calm guidance",
	},
	{
		icon: ShieldCheckIcon,
		label: "Private by design",
	},
];

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

			<section className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-5 pb-6 pt-8 sm:px-8 lg:min-h-[calc(100vh-5.75rem)] lg:grid-cols-[1.02fr_0.98fr] lg:px-10">
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

						<form
							id="waitlist"
							className="waitlist-form mt-9 scroll-mt-28"
							onSubmit={handleSubmit}
						>
							<label className="sr-only" htmlFor="email">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="you@company.com"
								autoComplete="email"
								required
							/>
							<button type="submit" disabled={isSubmitting}>
								<span>{isSubmitting ? "Joining" : "Join waitlist"}</span>
								<ArrowRightIcon size={18} weight="bold" />
							</button>
						</form>

						{message ? (
							<p
								className={`mt-4 flex items-center gap-2 text-sm font-medium ${
									status === "success" ? "text-(--success)" : "text-(--error)"
								}`}
								role="status"
							>
								{status === "success" ? (
									<CheckCircleIcon size={18} weight="fill" />
								) : null}
								{message}
							</p>
						) : null}
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
