import type { FormProps as RemixFormProps } from "@remix-run/react";

import { Form as RemixForm } from "@remix-run/react";


type FormProps = RemixFormProps & {
  redirectTo?: string;
  form?: React.ComponentType<FormProps>;
};

export function Form({
  redirectTo,
  children,
  // here we default to RemixForm
  form: Component = RemixForm,
  ...props
}: FormProps) {
  return (
    <Component {...props} className="some classes">
      
    </Component>
  );
}