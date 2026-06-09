export const formatSize = (size: number): string => {
  const mbSize = size / (1024 * 1024);
  let formattedSize;

  if (mbSize < 1) {
    // Less than 1 MB -> Measure in KB
    const fileSizeInKB = (size / 1024).toFixed(2);
    formattedSize = `${fileSizeInKB} KB`;
  } else if (mbSize > 1023) {
    // More than 1023 MB -> Measure in GB
    const fileSizeInGB = (mbSize / 1024).toFixed(2);
    formattedSize = `${fileSizeInGB} GB`;
  } else {
    // Everything else -> Measure in MB
    formattedSize = `${mbSize.toFixed(2)} MB`;
  }

  return formattedSize;
};
