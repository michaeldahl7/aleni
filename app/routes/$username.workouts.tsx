import { Outlet } from "@remix-run/react";

export default function WorkoutsIndexRoute() {
  return (
    <div className="flex justify-center">
      <Outlet />
    </div>
  );
}
