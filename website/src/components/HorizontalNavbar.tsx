import {
    arabicClassName,
    arabicTextProps,
} from "@/lib/arabic";

import navbarData from "./NavbarData.json";

const styles = {
    nav: "px-4 py-4 text-white",
    inner: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
    title: "text-2xl font-semibold text-white",
    list: "flex flex-wrap gap-2",
    link: "block rounded-md px-3 py-2 text-lg font-medium text-white transition-colors hover:text-gray-300",
};

function HorizontalNavbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.inner}>
                <div
                    className={`${styles.title} ${arabicClassName(navbarData.title, "text-[1.575rem]")}`}
                    {...arabicTextProps(navbarData.title)}
                >
                    {navbarData.title}
                </div>
                <ul className={styles.list}>
                    {
                        navbarData.links.map((link) => (
                            <li key={link.path}>
                                <a
                                    className={`${styles.link} ${arabicClassName(link.label, "text-[1.18125rem]")}`}
                                    href={link.path}
                                    {...arabicTextProps(link.label)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </nav>
    );
}

export default HorizontalNavbar;
