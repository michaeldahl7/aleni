import { NavLink } from "@remix-run/react";
import { Form } from "@remix-run/react";

export default function TopNav() {
  return (
    // <nav>
    //   <NavLink to="/">Home</NavLink>
    //   <NavLink to="/signup">Signup</NavLink>
    //   {/* <NavLink to="/contact">Contact</NavLink> */}
    // </nav>
    <div className="navbar bg-base-100">
      <div className="flex-1">
        {/* <Form action="/member" method="post">
          <button className="btn btn-ghost text-xl">Member</button>
        </Form> */}
        <NavLink className="btn btn-ghost text-xl" to="/member">
          Member
        </NavLink>
        {/* <a className="btn btn-ghost text-xl">Member</a> */}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Profile avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            {/* <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li> */}
            <li>
              <Form action="/logout" method="post" className="flex">
                <button className="btn w-full">Logout</button>
              </Form>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
