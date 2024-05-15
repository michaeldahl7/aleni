
import { Link } from "@remix-run/react";


export function loader() {
    return new Response("Not Found", {
      status: 404,
    });
  }


export default function NotFoundPage() {
    return (    
        <div>Page not found<div>
            </div><Link to="/">Go home</Link></div>)
    }