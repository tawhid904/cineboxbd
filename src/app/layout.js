import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import AppSkeletonTheme from "@/components/ui/AppSkeletonTheme";
import { Archivo, Archivo_Black, Geist_Mono } from "next/font/google";
import "react-loading-skeleton/dist/skeleton.css";
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
	metadataBase: new URL('https://www.cineboxbd.bond'),
	title: {
		template: '%s | CineboxBD',
		default: 'CineboxBD | Watch Movies & Series Online Bangladesh',
	},
	description: 'CineboxBD is your go-to movie and TV series discovery site in Bangladesh. Find trending films, top-rated series, and explore by genre, rating, and more.',
	keywords: ['watch movies online Bangladesh', 'movies online BD', 'Bangladeshi movie website', 'trending movies', 'watch series online free BD'],
	authors: [{ name: 'CineboxBD' }],
	creator: 'CineboxBD',
	publisher: 'CineboxBD',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'black-translucent',
		title: 'CineboxBD',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: { index: true, follow: true },
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://www.cineboxbd.bond',
		siteName: 'CineboxBD',
		title: 'CineboxBD | Watch Movies & Series Online Bangladesh',
		description: 'CineboxBD is your go-to movie and TV series discovery site in Bangladesh.',
		images: [{ url: '/preview.png', width: 1200, height: 630, alt: 'CineboxBD' }],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'CineboxBD | Watch Movies & Series Online Bangladesh',
		description: 'CineboxBD is your go-to movie and TV series discovery site in Bangladesh.',
		images: ['/preview.png'],
	},
	alternates: { canonical: '/' },
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
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
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'Organization',
							name: 'CineboxBD',
							url: 'https://www.cineboxbd.bond',
							logo: 'https://www.cineboxbd.bond/text-logo.png',
							description: 'CineboxBD is a movie and TV series discovery website for Bangladesh.',
						}),
					}}
				/>
				<SiteHeader />
				<main id="main" className="flex-1">
					<AppSkeletonTheme>
						{children}
					</AppSkeletonTheme>
				</main>
				<SiteFooter />
			</body>
		</html>
	);
}
