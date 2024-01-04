import { NavLink } from "react-router-dom";
import './style.scss'
const LayoutBottomProfile = () => {
  return (
    <div>
      <nav className="nav-bar">
        <div className="nav-bar-bottom-wrapper">
          <div className="nav-bar-bottom-container">
            <NavLink to="/dashboard"><div className="nav-bar-bottom-item">MY PROFILE</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">Improve Profile</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">Get Certified</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">Promote Profile</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">My Rewards</div></NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default LayoutBottomProfile