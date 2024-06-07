"use client";

import {
  FormControl,
  FormLabel,
  Button,
  Input,
  Grid,
  Stack,
} from "@chakra-ui/react";

type PasswordLoginProps = {
  backendUrl: string;
};

export function PasswordLogin({ backendUrl }: PasswordLoginProps) {
  return (
    <form action={backendUrl + "/login/password"} method="POST">
      <Grid templateColumns="1fr" gap={4} w="100%">
        <Stack spacing={2} align="center">
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
        </Stack>
      </Grid>
    </form>
  );
}
