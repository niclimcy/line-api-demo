"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
  Flex,
  Divider,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { PasswordLogin } from "@/components/password-login";
import { FederatedLogin } from "@/components/federated-login";

type LoginUIProps = {
  backendUrl: string;
};

export default function LoginUI({ backendUrl }: LoginUIProps) {
  return (
    <Flex minH="100vh" align="center" justify="center" p={[6, 12, 24]}>
      <Card maxW="md" w="full">
        <CardHeader>
          <Heading size="lg">Login</Heading>
        </CardHeader>
        <CardBody>
          <FederatedLogin backendUrl={backendUrl} />
          <Box position="relative" padding="6">
            <Divider />
            <AbsoluteCenter bg="white" px="4">
              OR
            </AbsoluteCenter>
          </Box>
          <PasswordLogin backendUrl={backendUrl} />
        </CardBody>
      </Card>
    </Flex>
  );
}
