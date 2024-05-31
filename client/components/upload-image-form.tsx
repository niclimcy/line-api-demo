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
import { uploadImages } from "@/app/actions";
import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { SubmitButton } from "./submit-btn";

const initialState = {
  message: "",
  success: false,
  resetKey: Date.now().toString(),
};

export function UploadImageForm() {
  const [formState, formAction] = useFormState(uploadImages, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current && formState.success == true) {
      formRef.current.reset();
    }
  }, [formState.resetKey]);

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Upload Images</CardTitle>
        <CardDescription>
          Upload images to cloudinary through express backend
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-2">
          {formState.message && (
            <Alert variant={formState.success ? "default" : "destructive"}>
              <AlertTitle>Image(s) uploaded!</AlertTitle>
            </Alert>
          )}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Image</Label>
            <Input id="picture" type="file" name="imageFiles" multiple />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton>Upload Images</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
