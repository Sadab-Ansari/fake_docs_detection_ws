import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="flex flex-col items-center mt-20 text-center">
        <h1 className="text-4xl font-bold">Fake Documents Detection</h1>
        <p className="text-lg mt-4 text-gray-600">
          Upload a document to detect if it is fake.
        </p>
        <FileUpload />
      </main>
    </div>
  );
}
