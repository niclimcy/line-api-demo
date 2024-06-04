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
import { SubmitButton } from "@/components/submit-btn";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  function renderMessages() {
    if (
      Array.isArray(formState.message) &&
      formState.message.every((item) => typeof item === "string")
    ) {
      return (
        <>
          <h3>Uploaded Image(s):</h3>
          {formState.message.map((url, index) => (
            <Button asChild variant="link" className="w-full">
              <Link href={url} key={index}>
                Image {index + 1}
              </Link>
            </Button>
          ))}
        </>
      );
    } else if (typeof formState.message === "string") {
      return <p>{formState.message}</p>;
    }

    return null;
  }

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
              <AlertTitle>{renderMessages()}</AlertTitle>
            </Alert>
          )}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Image</Label>
            <Input id="picture" type="file" name="images" multiple />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton>Upload Images</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
