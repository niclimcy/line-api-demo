import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
} from "@chakra-ui/react";

type SignUpUIProps = {
  backendUrl: string;
};

export default function SignUpUI({ backendUrl }: SignUpUIProps) {
  return (
    <Flex minH="100vh" align="center" justify="center" p={[6, 12, 24]}>
      <Card maxW="md" w="full">
        <CardHeader>
          <Heading>Book Store</Heading>
        </CardHeader>
        <CardBody>
          <form action={backendUrl + "/create-user"} method="POST">
            <VStack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  type="name"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@example.com"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input type="password" id="password" name="password" />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="verifyPassword">Verify Password</FormLabel>
                <Input
                  type="password"
                  id="verifyPassword"
                  name="verifyPassword"
                />
              </FormControl>
              <Button type="submit">Sign Up</Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Flex>
  );
}
