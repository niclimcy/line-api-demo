"use client";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
  Flex,
  Icon,
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
          <Heading size="lg">Book Store</Heading>
          {user ? (
            <Heading size="sm">{user.name}</Heading>
          ) : (
            <Heading size="sm">Not Logged In</Heading>
          )}
        </CardHeader>
        <CardBody>
          {user ? (
            <>
              <Heading size="md" mb={2}>
                Actions
              </Heading>
              <Box>
                <Button
                  as={Link}
                  href="/line-chat"
                  variant="outline"
                  w="full"
                  mb={2}
                >
                  <Icon as={SiLine} boxSize={5} mr="2" />
                  Message LINE users
                </Button>
                <Button
                  as={Link}
                  href={backendUrl + "/users/export"}
                  variant="outline"
                  w="full"
                  mb={2}
                >
                  <Icon as={FileDownIcon} boxSize={5} mr="2" />
                  Export all user data
                </Button>
                <Button
                  as={Link}
                  href="/upload-files"
                  variant="outline"
                  w="full"
                  mb={2}
                >
                  <Icon as={CloudUploadIcon} boxSize={5} mr="2" />
                  Upload files
                </Button>
                <Button
                  as={Link}
                  href="/chat"
                  variant="outline"
                  w="full"
                  mb={2}
                >
                  <Icon as={MessageSquareTextIcon} boxSize={5} mr="2" />
                  Chat with others
                </Button>
                <Button
                  as={Link}
                  href={backendUrl + "/logout"}
                  variant="outline"
                  w="full"
                >
                  <Icon as={LogOutIcon} boxSize={5} mr="2" />
                  Logout
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Button as={Link} href="/login" variant="outline" w="full" mb={2}>
                <Icon as={LogInIcon} boxSize={5} mr="2" />
                Log In
              </Button>
              <Button as={Link} href="/sign-up" variant="outline" w="full">
                <Icon as={UserRoundPlusIcon} boxSize={5} mr="2" />
                Sign Up Now
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
}
