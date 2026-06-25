import navbarData from "./VerticalNavbar-Data.json"

const styles = {
    nav: "flex min-h-screen w-full flex-col items-end gap-8 border-r border-gray-200 bg-white px-6 py-8 text-gray-900",
    title: "text-xl font-semibold",
    list: "flex flex-col items-stretch gap-2 text-left",
    link: "block rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-950",
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
