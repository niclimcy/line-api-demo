"use client";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Box,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { SiLine } from "@icons-pack/react-simple-icons";
import {
  FileDownIcon,
  CloudUploadIcon,
  MessageSquareTextIcon,
  LogInIcon,
  LogOutIcon,
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
                <Link as={NextLink} href="/line-chat" passHref>
                  <Button variant="outline" w="full" mb={2}>
                    <SiLine style={{ marginRight: "0.5rem" }} size={20} />
                    Message LINE users
                  </Button>
                </Link>
                <Link
                  as={NextLink}
                  href={backendUrl + "/users/export"}
                  passHref
                >
                  <Button variant="outline" w="full" mb={2}>
                    <FileDownIcon style={{ marginRight: "0.5rem" }} size={20} />
                    Export all user data
                  </Button>
                </Link>
                <Link as={NextLink} href="/upload-files" passHref>
                  <Button variant="outline" w="full" mb={2}>
                    <CloudUploadIcon
                      style={{ marginRight: "0.5rem" }}
                      size={20}
                    />
                    Upload files
                  </Button>
                </Link>
                <Link as={NextLink} href="/chat" passHref>
                  <Button variant="outline" w="full" mb={2}>
                    <MessageSquareTextIcon
                      style={{ marginRight: "0.5rem" }}
                      size={20}
                    />
                    Chat with others
                  </Button>
                </Link>
                <Link as={NextLink} href={backendUrl + "/logout"} passHref>
                  <Button variant="outline" w="full">
                    <LogOutIcon style={{ marginRight: "0.5rem" }} size={20} />
                    Logout
                  </Button>
                </Link>
              </Box>
            </>
          ) : (
            <Link as={NextLink} href="/login" passHref>
              <Button variant="outline" w="full">
                <LogInIcon style={{ marginRight: "0.5rem" }} size={20} />
                Log In
              </Button>
            </Link>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
}
