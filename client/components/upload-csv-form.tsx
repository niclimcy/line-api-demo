"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { uploadCSV } from "@/app/actions";
import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { SubmitButton } from "@/components/submit-btn";

const initialState = {
  message: "",
  success: false,
  resetKey: Date.now().toString(),
};

export function UploadCSVForm() {
  const [formState, formAction] = useFormState(uploadCSV, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current && formState.success == true) {
      formRef.current.reset();
    }
  }, [formState.resetKey]);

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Upload CSV</CardTitle>
        <CardDescription>
          Upload one CSV file at a time to express backend
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-2">
          {formState.message && (
            <Alert variant={formState.success ? "default" : "destructive"}>
              <AlertTitle>{formState.message}</AlertTitle>
            </Alert>
          )}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csvFile">CSV File</Label>
            <Input id="csvFile" type="file" name="csv" />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton>Upload CSV</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
