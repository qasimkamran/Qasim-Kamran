import navbarData from "./VerticalNavbar-Data.json";

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
