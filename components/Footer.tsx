import Link from 'next/link'

const Footer = () => {
    return (
        <div className="min-h-screen bg-[#eeecea] font-[Figtree] flex flex-col relative overflow-hidden">

            {/* Decorative large background number / watermark */}
            <div
                className="absolute right-0 bottom-0 select-none pointer-events-none leading-none font-[Coiny] text-[#E43B37] opacity-[0.04]"
                style={{ fontSize: "clamp(240px, 35vw, 480px)", lineHeight: 1 }}
                aria-hidden="true"
            >
                snap
            </div>

            {/* Main content — grows to fill, perfectly centered vertically */}
            <div className="flex-1 flex flex-col justify-center px-5 sm:px-10 lg:px-20 py-24 max-w-[1600px] mx-auto w-full">

                {/* Headline */}
                <h2
                    className=" font-black text-[#111] leading-[1.0] tracking-tight mb-8"
                    style={{ fontSize: "clamp(48px, 8vw, 112px)" }}
                >
                    Try it.<br />
                    You'll love<br />
                    every shot.
                </h2>

                {/* Sub-copy */}
                <p className="text-[#777] font-semibold text-base sm:text-lg mb-10 max-w-sm leading-relaxed">
                    Open your browser, allow camera, and start snapping. Nothing to install.
                </p>

                {/* CTA button */}
                <div className="flex flex-row items-start gap-4">
                    <a
                        href="/photobooth"
                        className="inline-flex items-center gap-3 bg-[#111] text-white rounded-full px-8 py-4 text-base font-black hover:bg-[#333] transition-colors no-underline group"
                    >

                        Get Started
                    </a>

                    

                    <p className="text-[#bbb] text-xs font-semibold self-center">
                        Works in any modern browser
                    </p>
                </div>
            </div>

            {/* Footer strip */}
            <footer className="px-5 sm:px-10 lg:px-20 py-8 border-t border-[#ddd] flex flex-row items-start sm:items-center justify-between gap-6 max-w-[1600px] mx-auto w-full">

                {/* Brand */}
                <Link
                    href="/"
                    className="group flex items-center gap-1.5 text-[#E43B37] font-bold text-lg tracking-tight no-underline font-[Coiny]"
                >
                    Snapstop
                    <span className="w-7 h-7 transition-transform duration-150 ease-out group-hover:scale-125 group-hover:-translate-y-1">
                        <img src="/assets/icon.png" alt="Snapstop icon" className="w-full h-full object-contain" />
                    </span>
                </Link>

                {/* Footer links — right-aligned like the reference */}
                <nav className="flex flex-col gap-1.5 text-right">
                    <span className="text-[#bbb] text-xs font-semibold">© {new Date().getFullYear()} Snapstop</span>
                    {[
                        { label: "About", href: "/about" },
                        { label: "Support", href: "/support" },
                        { label: "Open App", href: "/photobooth" },
                        { label: "Developed by: James Talamo - 2026", href: "https://jamestalamo.com" },
                    ].map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="text-[#999] text-xs font-semibold hover:text-[#E43B37] transition-colors no-underline"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </footer>
        </div>
    )
}

export default Footer
