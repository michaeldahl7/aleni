import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Form,
  Link,
  Outlet,
  isRouteErrorResponse,
  redirect,
  useLoaderData,
  useRouteError,
  useSubmit,
} from "@remix-run/react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import { Home, Menu, Settings, Search, Dumbbell, User } from "lucide-react";

import { requireUser } from "~/utils/require-user.server";
import { ModeToggle } from "~/components/ModeToggle";
import { useRef } from "react";
import invariant from "tiny-invariant";

export const loader = defineLoader(async ({ params, request }) => {
  const user = await requireUser(request);
  const { username } = params;
  if (user && user.username !== username) {
    throw redirect("/");
  }

  return user;
});

export default function UsernameRoute() {
  const user = useLoaderData<typeof loader>();
  const username = user.username;
  invariant(username, "Username not found");
  return (
    <div className="flex min-h-screen w-full flex-col ">
      <div className="flex min-h-screen flex-col sm:gap-4">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium sm:flex sm:flex-row sm:items-center sm:gap-5 sm:text-sm lg:gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Home className="h-6 w-6" />
              <span className="sr-only">Aleni</span>
            </Link>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="/"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Dumbbell className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Aleni</span>
                </Link>
                <Link
                  to="/"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Workouts
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <ModeToggle />
          <UserDropdown username={username} />
        </header>
        <Outlet />
      </div>
    </div>
  );
}

function UserDropdown(username: string) {
  const submit = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button asChild variant="secondary">
          <Link to={`/${username}`} className="flex items-center gap-2">
            <User></User>
          </Link>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent sideOffset={10} align="start">
          <DropdownMenuItem
            asChild
            // this prevents the menu from closing before the form submission is completed
            onSelect={(event) => {
              event.preventDefault();
              submit(formRef.current);
            }}
          >
            <Form action="/logout" method="POST" ref={formRef}>
              <Button className="  cursor-default " variant="ghost">
                Logout
              </Button>
            </Form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
