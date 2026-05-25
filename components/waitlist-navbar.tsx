import Image from "next/image";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

type ThemeMode = "light" | "dark";

interface WaitlistNavbarProps {
	resolvedTheme: ThemeMode;
	onThemeToggle: () => void;
}

export function WaitlistNavbar({
	resolvedTheme,
	onThemeToggle,
}: WaitlistNavbarProps) {
	const ThemeIcon = resolvedTheme === "dark" ? SunIcon : MoonIcon;
	const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

	return (
		<header className="site-header">
			<div className="site-nav">
				<div className="flex items-center gap-3">
					<Image
						className="brand-logo"
						src="/icon.png"
						alt=""
						width={40}
						height={40}
					/>
					<span className="text-lg font-semibold tracking-widest text-(--muted)">
						tranqli
					</span>
				</div>

				<button
					type="button"
					className="theme-toggle"
					onClick={onThemeToggle}
					aria-label={`Switch to ${nextTheme} mode`}
				>
					<ThemeIcon size={18} weight="bold" />
				</button>
			</div>
		</header>
	);
}
