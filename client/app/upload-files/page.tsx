"use client";

import { Flex, Stack } from "@chakra-ui/react";
import { UploadImageForm } from "@/components/upload-image-form";
import { UploadCSVForm } from "@/components/upload-csv-form";

export default function UploadFile() {
  return (
    <Flex minH="100vh" align="center" justify="center" p={[6, 12, 24]}>
      <Stack direction="column" spacing={8} width="100%" maxW="md">
        <UploadCSVForm />
        <UploadImageForm />
      </Stack>
    </Flex>
  );
}
