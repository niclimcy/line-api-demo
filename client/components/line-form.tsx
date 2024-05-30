"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { sendMessage } from "@/app/actions";
import { LineUser } from "@/lib/types";
import { useFormStatus, useFormState } from "react-dom";
import { useEffect, useRef } from "react";

type LineFormProps = {
  users: LineUser[];
};

const initialState = {
  message: "",
  success: false,
  resetKey: Date.now().toString(),
};

export function LineForm(props: LineFormProps) {
  const { pending } = useFormStatus();
  const [formState, formAction] = useFormState(sendMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current && formState.success == true) {
      formRef.current.reset();
    }
  }, [formState.resetKey]);

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Send LINE Message</CardTitle>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-2">
          {formState.message && (
            <Alert variant={formState.success ? "default" : "destructive"}>
              <AlertTitle>{formState.message}</AlertTitle>
            </Alert>
          )}
          <Select name="recipient">
            <SelectTrigger>
              <SelectValue placeholder="-- SELECT A USER --" />
            </SelectTrigger>
            <SelectContent>
              {props.users.map((user) => {
                return (
                  <SelectItem value={user.userId} key={user.userId}>
                    {user.displayName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Textarea name="message" placeholder="Type your message here." />
        </CardContent>
        <CardFooter>
          <Button type="submit" aria-disabled={pending}>
            Send message
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
