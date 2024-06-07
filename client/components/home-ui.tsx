"use client";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Flex,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { SiLine } from "@icons-pack/react-simple-icons";
import {
  FileDownIcon,
  CloudUploadIcon,
  MessageSquareTextIcon,
  LogInIcon,
  LogOutIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { UserSession } from "@/types";

type HomeUIProps = {
  user?: UserSession;
  backendUrl: string;
};

export default function HomeUI({ user, backendUrl }: HomeUIProps) {
  return (
    <Flex minH="100vh" align="center" justify="center" p={[6, 12, 24]}>
      <Card maxW="md" w="full">
        <CardHeader>
          <Heading>Book Store</Heading>
          <Text size="sm">{user ? user.name : "Not Logged In"}</Text>
        </CardHeader>
        <CardBody>
          {user ? (
            <>
              <Heading size="md">Actions</Heading>
              <VStack spacing={4}>
                <Button
                  as={Link}
                  href="/line-chat"
                  variant="outline"
                  w="full"
                  leftIcon={<Icon as={SiLine} boxSize={5} />}
                >
                  Message LINE users
                </Button>
                <Button
                  as={Link}
                  href={backendUrl + "/users/export"}
                  variant="outline"
                  w="full"
                  leftIcon={<Icon as={FileDownIcon} boxSize={5} />}
                >
                  Export all user data
                </Button>
                <Button
                  as={Link}
                  href="/upload-files"
                  variant="outline"
                  w="full"
                  leftIcon={<Icon as={CloudUploadIcon} boxSize={5} />}
                >
                  Upload files
                </Button>
                <Button
                  as={Link}
                  href="/chat"
                  variant="outline"
                  w="full"
                  leftIcon={<Icon as={MessageSquareTextIcon} boxSize={5} />}
                >
                  Chat with others
                </Button>
                <Button
                  as={Link}
                  href={backendUrl + "/logout"}
                  variant="outline"
                  w="full"
                  leftIcon={<Icon as={LogOutIcon} boxSize={5} />}
                >
                  Logout
                </Button>
              </VStack>
            </>
          ) : (
            <VStack spacing={4}>
              <Button
                as={Link}
                href="/login"
                variant="outline"
                w="full"
                leftIcon={<Icon as={LogInIcon} boxSize={5} />}
              >
                Log In
              </Button>
              <Button
                as={Link}
                href="/sign-up"
                variant="outline"
                w="full"
                leftIcon={<Icon as={UserRoundPlusIcon} boxSize={5} />}
              >
                Sign Up Now
              </Button>
            </VStack>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
}
