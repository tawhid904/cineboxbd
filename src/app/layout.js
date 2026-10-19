import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { Archivo, Archivo_Black, Geist_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
	subsets: ["latin"],
	variable: "--font-archivo",
	display: "swap",
});

const archivoBlack = Archivo_Black({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-archivo-black",
	display: "swap",
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
	display: "swap",
});

export const metadata = {
	title: {
		default: "CINEBOXBD - Home",
		template: "CINEBOXBD - %s",
	},
	description:
		"Trending films and series with real ratings and genre rows that make sense. Pick something good tonight.",
	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: "Cineboxbd",
	},
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			data-scroll-behavior="smooth"
			suppressHydrationWarning
			className={`${archivo.variable} ${archivoBlack.variable} ${geistMono.variable} h-full antialiased`}
		>
			{/* Browser extensions may inject attributes into <html>/<body> before
			    React hydrates. suppressHydrationWarning silences attribute-level
			    mismatches on these two elements only - children are still checked. */}
			<body className="flex min-h-full flex-col" suppressHydrationWarning>
				<SiteHeader />
				<main id="main" className="flex-1">
					{children}
				</main>
				<SiteFooter />
			</body>
		</html>
	);
}
