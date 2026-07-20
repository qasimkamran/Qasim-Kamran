import {
    arabicClassName,
    arabicTextProps,
} from "@/lib/arabic";

import navbarData from "@/data/navbarData.json";

const styles = {
    nav: "flex min-h-screen w-full flex-col items-end gap-8 pb-8 pl-6 pr-[12%] pt-12 text-white",
    title: "mr-8 text-2xl font-semibold text-white",
    list: "mr-8 flex flex-col items-stretch gap-2 text-left",
    link: "block rounded-md px-3 py-2 text-left text-lg font-medium text-white transition-colors hover:text-gray-300",
};

function VerticalNavbar() {
    return (
        <nav className={styles.nav}>
            <div className="flex flex-col items-end gap-8 border-r border-white pr-6">
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

export default VerticalNavbar;
