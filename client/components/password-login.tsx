"use client";

import {
  FormControl,
  FormLabel,
  Button,
  Input,
  VStack,
} from "@chakra-ui/react";

type PasswordLoginProps = {
  backendUrl: string;
};

export function PasswordLogin({ backendUrl }: PasswordLoginProps) {
  return (
    <form action={backendUrl + "/login/password"} method="POST">
      <VStack spacing={4}>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            id="email"
            name="username"
            placeholder="email@example.com"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input type="password" id="password" name="password" />
        </FormControl>
        <Button type="submit">Login with Email</Button>
      </VStack>
    </form>
  );
}
