"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@chakra-ui/react";
import { ReactNode } from "react";

type SubmitButtonProps = {
  children?: ReactNode;
};

export function SubmitButton(props: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending} colorScheme="blue">
      {props.children}
    </Button>
  );
}
