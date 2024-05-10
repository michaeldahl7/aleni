import { NavLink } from "@remix-run/react";

export default function Nav() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/signup">Signup</NavLink>
      {/* <NavLink to="/contact">Contact</NavLink> */}
    </nav>
  );
}
