import navbarData from "./VerticalNavbar-Data.json"

const styles = {
    nav: "flex min-h-screen w-full flex-col items-end gap-8 py-8 pl-6 pr-[12%] text-white",
    title: "text-2xl font-semibold text-white",
    list: "flex flex-col items-stretch gap-2 text-left",
    link: "block rounded-md px-3 py-2 text-left text-lg font-medium text-white transition-colors hover:text-gray-300",
};

function VerticalNavbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.title}>{navbarData.title}</div>
            <ul className={styles.list}>
                {
                    navbarData.links.map((link) => (
                        <li key={link.path}>
                            <a className={styles.link} href={link.path}>
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
