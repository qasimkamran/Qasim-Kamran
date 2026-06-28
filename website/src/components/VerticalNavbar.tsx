import {
    arabicClassName,
    arabicTextProps,
} from "@/lib/arabic";

import navbarData from "./VerticalNavbar-Data.json";

const styles = {
    nav: "flex min-h-screen w-full flex-col items-end gap-8 py-8 pl-6 pr-[12%] text-white",
    title: "text-2xl font-semibold text-white",
    list: "flex flex-col items-stretch gap-2 text-left",
    link: "block rounded-md px-3 py-2 text-left text-lg font-medium text-white transition-colors hover:text-gray-300",
};

function VerticalNavbar() {
    return (
        <nav className={styles.nav}>
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
        </nav>
    );
}

export default VerticalNavbar;
