import navbarData from "./VerticalNavbar-Data.json";

const styles = {
    nav: "border-b border-gray-200 bg-white px-4 py-4 text-gray-900",
    inner: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
    title: "text-xl font-semibold",
    list: "flex flex-wrap gap-2",
    link: "block rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-950",
};

function HorizontalNavbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.inner}>
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
            </div>
        </nav>
    );
}

export default HorizontalNavbar;
