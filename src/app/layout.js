import { Archivo, Archivo_Black, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

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
		default: "MOVIEBOXBD — Films & series, hand-picked.",
		template: "%s · MOVIEBOXBD",
	},
	description:
		"MOVIEBOXBD is a carefully kept guide to what to watch next — real ratings, honest picks, nothing buried in noise.",
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
			    mismatches on these two elements only — children are still checked. */}
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
