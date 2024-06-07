"use client";

import { Button, Icon, Grid, GridItem, Stack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { SiLine, SiGoogle, SiFacebook } from "@icons-pack/react-simple-icons";

type FederatedLoginProps = {
  backendUrl: string;
};

export function FederatedLogin({ backendUrl }: FederatedLoginProps) {
  return (
    <Grid templateColumns="1fr" gap={4} w="100%">
      <Stack spacing={2} align="center">
        <Button
          as={Link}
          href={backendUrl + "/login/federated/line"}
          variant="outline"
          leftIcon={<Icon as={SiLine} boxSize={5} />}
          width="100%"
        >
          Sign-in with LINE
        </Button>
        <Button
          as={Link}
          href={backendUrl + "/login/federated/google"}
          variant="outline"
          leftIcon={<Icon as={SiGoogle} boxSize={5} />}
          width="100%"
        >
          Sign-in with Google
        </Button>
        <Button
          as={Link}
          href={backendUrl + "/login/federated/facebook"}
          variant="outline"
          leftIcon={<Icon as={SiFacebook} boxSize={5} />}
          width="100%"
        >
          Sign-in with Facebook
        </Button>
      </Stack>
    </Grid>
  );
}
