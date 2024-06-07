"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  Alert,
  AlertTitle,
  Icon,
} from "@chakra-ui/react";
import { SiLine } from "@icons-pack/react-simple-icons";
import { sendMessage } from "@/app/actions";
import { LineUser } from "@/lib/types";
import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { SubmitButton } from "@/components/submit-btn";

type LineFormProps = {
  users: LineUser[];
};

const initialState = {
  message: "",
  success: false,
  resetKey: Date.now().toString(),
};

export function LineForm(props: LineFormProps) {
  const [formState, formAction] = useFormState(sendMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current && formState.success === true) {
      formRef.current.reset();
    }
  }, [formState.resetKey]);

  return (
    <Flex
      minH="100vh"
      alignItems="center"
      justifyContent="center"
      p={[6, 12, 24]}
    >
      <Card maxW="md" w="full">
        <CardHeader>
          <Icon as={SiLine} boxSize={7} width="full" />
          <Heading textAlign="center" size="md">
            Send LINE Message
          </Heading>
        </CardHeader>
        <form action={formAction} ref={formRef}>
          <CardBody>
            {formState.message && (
              <Alert
                status={formState.success ? "success" : "error"}
                mb={4}
                borderRadius={4}
              >
                <AlertTitle>{formState.message}</AlertTitle>
              </Alert>
            )}
            <FormControl mb={4}>
              <FormLabel htmlFor="recipient">Recipient</FormLabel>
              <Select
                id="recipient"
                name="recipient"
                placeholder="-- SELECT A USER --"
              >
                {props.users.map((user) => (
                  <option value={user.userId} key={user.userId}>
                    {user.displayName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="message">Message</FormLabel>
              <Textarea
                id="message"
                name="message"
                placeholder="Type your message here."
              />
            </FormControl>
          </CardBody>
          <CardFooter>
            <SubmitButton>Send message</SubmitButton>
          </CardFooter>
        </form>
      </Card>
    </Flex>
  );
}
