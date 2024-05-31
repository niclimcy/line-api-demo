import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadImageForm } from "@/components/upload-image-form";

export default async function UploadFile() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-8">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Upload CSV</CardTitle>
          <CardDescription>
            Upload one CSV file at a time to express backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2"></CardContent>
      </Card>
      <UploadImageForm />
    </main>
  );
}
