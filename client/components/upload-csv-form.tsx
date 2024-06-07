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
} from "@chakra-ui/react";
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
    <Card maxW="md" w="full">
      <CardHeader>
        <Heading>Upload CSV</Heading>
        <Text size="sm">Upload one CSV file at a time to express backend</Text>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardBody>
          {formState.message && (
            <Alert variant={formState.success ? "default" : "destructive"}>
              <AlertTitle>{formState.message}</AlertTitle>
            </Alert>
          )}
          <FormControl>
            <FormLabel htmlFor="csvFile">CSV File</FormLabel>
            <Input id="csvFile" type="file" name="csv" />
          </FormControl>
        </CardBody>
        <CardFooter>
          <SubmitButton>Upload CSV</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  );
}
