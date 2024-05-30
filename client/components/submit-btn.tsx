"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type SubmitButtonProps = {
  children?: ReactNode;
};

export function SubmitButton(props: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {props.children}
    </Button>
  );
}
