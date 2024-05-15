import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { z } from 'zod';

const schema = z.object({
    set: z.array(
        z.object({ reps: z.string().min(1,"Reps are required"), weight: z.string().optional() })
    ),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // const user = await authenticator.isAuthenticated(request, {
    //   failureRedirect: "/login",
    // });
    
    const sets = [{ reps: 10, weight: '100' }, { reps: 10, weight: '100' }]
    // const todos = [{ title: 'title', notes: 'notes' }, { title: 'title2', notes: 'notes2' }]
    return json({ sets })
    // return json({ todos });
  };

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  // ...
}

export default function Login() {
  // Last submission returned by the server
  const  { sets }  = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult,
    defaultValue: {
        sets,
    },

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },

    // Validate the form on blur event triggered
    shouldValidate: 'onBlur',
  });

//   const todos = fields.todos.getFieldList()
const setsFields = fields.sets.getFieldList();
// const todoFields = fields.todos.getFieldList()
// console.log(todoFields)

  return (
    <Form method="post" id={form.id} onSubmit={form.onSubmit}>
      <ul>
        {setsFields.map((set) => {
        //   const todoFields = set
        const setFields = set.getFieldset()
          return (
            <li key={set.key}>
               <label>Reps</label>    
                <input name={setFields.reps.name} defaultValue={setFields.reps.value}/>
                <div>{setFields.reps.errors}</div>
                <label>Weight</label> 
                <input name={setFields.weight.name} defaultValue={setFields.reps.value}/>
                <div>{setFields.weight.errors}</div>
            </li>
          );
        })}
      </ul>
      <button
        {...form.insert.getButtonProps({
          name: fields.todos.name,
        })}
      >
        Add task
      </button>
    </Form>
  );
}