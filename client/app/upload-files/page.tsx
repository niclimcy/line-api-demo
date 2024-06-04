import { UploadImageForm } from "@/components/upload-image-form";
import { UploadCSVForm } from "@/components/upload-csv-form";

export default async function UploadFile() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-8">
      <UploadCSVForm />
      <UploadImageForm />
    </main>
  );
}
