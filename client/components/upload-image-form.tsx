"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertTitle,
  Button,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { uploadImages } from "@/app/actions";
import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { SubmitButton } from "@/components/submit-btn";

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
            <Button as={Link} href={url} key={index} variant="link" w="100%">
              Image {index + 1}
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
    <Card maxW="md" w="full">
      <CardHeader>
        <Heading>Upload Images</Heading>
        <Text size="sm">
          Upload images to cloudinary through express backend
        </Text>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardBody>
          {formState.message && (
            <Alert variant={formState.success ? "default" : "destructive"}>
              <AlertTitle>{renderMessages()}</AlertTitle>
            </Alert>
          )}
          <FormControl>
            <FormLabel htmlFor="picture">Image</FormLabel>
            <Input id="picture" type="file" name="images" multiple />
          </FormControl>
        </CardBody>
        <CardFooter>
          <SubmitButton>Upload Images</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
