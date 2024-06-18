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
  useRouteError,
} from "@remix-run/react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { unstable_defineLoader as defineLoader } from "@remix-run/node";
import { Home, Menu, Settings, Search, Dumbbell } from "lucide-react";

import { requireUserSession } from "~/utils/require-user.server";
import { ModeToggle } from "~/components/ModeToggle";

export const loader = defineLoader(async ({ params, request }) => {
  const user = await requireUserSession(request);
  const { username } = params;
  if (user && user.username !== username) {
    throw new Response("Not Found", { status: 404 });
  }

  return user;
});

export default function UsernameRoute() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside> */}
      <div className="flex min-h-screen flex-col sm:gap-4  ">
        <header className="sticky top-0  flex h-16 items-center gap-4 border-b bg-background px-4  md:px-6">
          <nav className="hidden flex-col gap-6 text-lg font-medium sm:flex sm:flex-row sm:items-center sm:gap-5 sm:text-sm lg:gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Home className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              to="/"
              className="text-foreground transition-colors hover:text-foreground"
            >
              Workouts
            </Link>
            <Link
              to="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Analytics
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
                <Link
                  to="/"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Analytics
                </Link>
                <Link
                  to="/"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <img
                  src="/images/dahl_trash.png"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Form action="/" method="post" className="flex-grow">
                  <Button variant="ghost" size="sm" className="w-full">
                    Settings
                  </Button>
                </Form>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="flex-grow">
                <Form action="/logout" method="post">
                  <Button variant="ghost" size="sm" className="w-full">
                    Logout
                  </Button>
                </Form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
