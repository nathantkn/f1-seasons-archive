import { Outlet } from "react-router-dom";
import SideNav from "./components/SideNav";

function Layout() {
    return (
        <div className="whole-page">
            <SideNav />
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
}

export default Layout;