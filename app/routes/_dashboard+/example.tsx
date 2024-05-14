import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
  } from "@remix-run/node"
  import { json } from "@remix-run/node"
  import { useLoaderData } from "@remix-run/react"
  import { useState } from "react"

  export async function action({
    request,
  }: ActionFunctionArgs) {
    const formData = await request.formData()
    const mutedWords = formData.getAll("mutedWords[]")
    global.mutedWords = mutedWords.filter(Boolean) as string[]
    return null
  }
  export async function loader({
    request,
  }: LoaderFunctionArgs) {
    return json({
      })
  }
  export default function Example() {

    const [inputCount, setInputCount] = useState(
      1
    )
    return (
      <div>
        <h1>Example: Dynamic Form Inputs</h1>
        <form method="post">
          <fieldset>
            <legend>Muted words</legend>
            {Array.from({ length: inputCount }, (_, i) => (
              <input
                key={i}
                type="text"
                name="mutedWords[]"
                defaultValue={mutedWords[i]}
              />
            ))}
            <button
              type="button"
              aria-label="Add another word"
              onClick={() =>
                setInputCount((count) => count + 1)
              }
            >
              +
            </button>
          </fieldset>
          <button type="submit">Save</button>
        </form>
      </div>
    )
  }
  