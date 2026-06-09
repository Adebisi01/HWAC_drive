import { getB2Files } from "@/actions/b2-files";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";

export const ViewContent = ({
  fileName,
  fileType,
}: {
  fileName: string;
  fileType: string;
}) => {
  const files = getB2Files();

  // 2. Target the specific file handle you just created
  const fileHandle = files.file(fileName);

  // 3. Generate a secure, temporary link (expiresIn is defined in seconds)
  const downloadUrl = async () => {
    return await fileHandle.url({ expiresIn: 3600 }); // Valid for 1 hour
  };
  const { data: secureUrl } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => await downloadUrl(),
  });

  // 4. Return the secure URL back to your React frontend

  return (
    <div>
      {fileType.includes("pdf") && (
        <Button>
          <a target="_blank" href={secureUrl || ""}>
            {secureUrl ? "Open PDF" : "Loading..."}
          </a>
        </Button>
      )}
      {fileType.includes("audio") && (
        <audio controls>
          <source src={secureUrl || ""} type="audio/mpeg" />
          <source src={secureUrl || ""} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      )}
      {fileType.includes("image") && (
        <img src={secureUrl || ""} alt={fileName} loading="lazy" />
      )}
    </div>
  );
};
