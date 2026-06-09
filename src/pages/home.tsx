import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckCircle2,
  CircleDashed,
  AlertCircle,
  Calendar,
  FileAudio,
  FileText,
  ImageIcon,
  Book,
  BarChart2,
  ChevronRight,
  MonitorPlay,
  FileBox,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogComponent } from "@/components/DialogComponent";
import { useForm, type FieldValues } from "react-hook-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { uploadToCloud } from "@/actions/uploadToCloud";
import type { Id } from "../../convex/_generated/dataModel";
import { formatDate } from "@/actions/formatDate";
import { formatSize } from "@/actions/formatSize";

type FileAsset = {
  id: string;
  name: string;
  icon: ReactNode;
  status: {
    label: string;
    variant: "success" | "error" | "neutral" | "warning";
    time?: string; // e.g., "2h" for processing tasks
    hasWarning?: boolean; // Renders the warning alert icon
  };
  type: {
    label?: string; // Text label like "Video"
    icon?: ReactNode; // React component for the type icon
    isEmpty?: boolean; // Flag to render the empty placeholder (e.g., "——")
  };
  owner: {
    name: string;
    initials: string;
    colorClass: string;
  };
  dateAdded?: string; // Optional since some assets might not have a date
  size: string;
  showDetails?: boolean; // UI state flag for hovered/active rows
};
type FileType = {
  _id: Id<"files">;
  _creationTime: number;
  type: string;
  name: string;
  owner: string;
  size: number;
};
/* const data: FileAsset[] = [
  {
    id: "1",
    name: "Intro to UX — Lesson 1.mp4",
    icon: <MonitorPlay className="h-4 w-4 text-slate-500" />,
    status: { label: "Ready", variant: "success" },
    type: { label: "Video" },
    owner: {
      name: "Lemi",
      initials: "L",
      colorClass: "bg-slate-100 text-slate-600",
    },
    size: "240 MB",
    showDetails: true,
  },
  {
    id: "2",
    name: "Podcast Ep. 12 — Master.wav",
    icon: <FileAudio className="h-4 w-4 text-slate-500" />,
    status: {
      label: "Processing",
      variant: "error",
      time: "2h",
      hasWarning: true,
    },
    type: { isEmpty: true },
    owner: {
      name: "Hadad",
      initials: "HA",
      colorClass: "bg-rose-100 text-rose-700",
    },
    dateAdded: "May 28, 2026",
    size: "1.2 GB",
  },
  {
    id: "3",
    name: "Brand Guidelines.pdf",
    icon: <FileText className="h-4 w-4 text-orange-400" />,
    status: { label: "Ready", variant: "success" },
    type: { icon: <BarChart2 className="h-4 w-4 text-slate-400" /> },
    owner: {
      name: "Aline",
      initials: "A",
      colorClass: "bg-slate-100 text-slate-600",
    },
    dateAdded: "May 22, 2026",
    size: "8.4 MB",
  },
  {
    id: "4",
    name: "Hero Banner — Homepage.png",
    icon: <ImageIcon className="h-4 w-4 text-slate-500" />,
    status: { label: "Ready", variant: "neutral" },
    type: { icon: <BarChart2 className="h-4 w-4 text-slate-400" /> },
    owner: {
      name: "Lemi",
      initials: "L",
      colorClass: "bg-slate-100 text-slate-600",
    },
    dateAdded: "May 20, 2026",
    size: "2.1 MB",
  },
  {
    id: "5",
    name: "Design Systems.epub",
    icon: <Book className="h-4 w-4 text-emerald-500" />,
    status: { label: "Ready", variant: "success" },
    type: { icon: <AlertCircle className="h-4 w-4 text-amber-500" /> },
    owner: {
      name: "Axel",
      initials: "AX",
      colorClass: "bg-orange-100 text-orange-700",
    },
    dateAdded: "May 18, 2026",
    size: "14 MB",
  },
  {
    id: "6",
    name: "Customer Story — Acme.mp4",
    icon: <MonitorPlay className="h-4 w-4 text-slate-500" />,
    status: { label: "Processing", variant: "neutral" },
    type: { isEmpty: true },
    owner: {
      name: "Axel",
      initials: "AX",
      colorClass: "bg-orange-100 text-orange-700",
    },
    size: "560 MB",
  },
]; */

export const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit } = useForm();

  console.log("Home");
  const filesData = useQuery(api.files.getFiles);
  console.log(filesData);
  const columns: ColumnDef<FileType>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!value)}
          aria-label="Select all"
          className="ml-2"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!value)}
          aria-label="Select row"
          className="ml-2"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        //get icon for the type of file
        const type = row.original.type;
        return (
          <div className="flex items-center gap-3 font-medium text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm">
              {type.includes("pdf") && <FileText />}
              {type.includes("image") && <ImageIcon />}
              {type.includes("audio") && <FileAudio />}
            </div>
            <span>{(row.getValue("name") as string).slice(0, 30)}</span>
            <span>
              {(row.getValue("name") as string).length > 30 ? "..." : ""}
            </span>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     const status = row.original.status;
    //     return (
    //       <div className="flex items-center gap-2">
    //         {status.variant === "success" && (
    //           <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    //         )}
    //         {status.variant === "error" && (
    //           <CircleDashed className="h-4 w-4 text-rose-500" />
    //         )}
    //         {status.variant === "neutral" && (
    //           <CircleDashed className="h-4 w-4 text-slate-300" />
    //         )}

    //         <span
    //           className={`text-sm ${
    //             status.variant === "success"
    //               ? "text-emerald-600"
    //               : status.variant === "error"
    //                 ? "text-rose-600"
    //                 : "text-slate-500"
    //           }`}
    //         >
    //           {status.label}
    //         </span>

    //         {status.time && (
    //           <span className="text-slate-400 text-sm">· {status.time}</span>
    //         )}
    //         {status.hasWarning && (
    //           <AlertCircle className="h-4 w-4 text-amber-500" />
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;
        if (!type) return <span className="text-slate-300">——</span>;
        if (type) return <span className="text-sm text-slate-500">{type}</span>;
        // return type.icon;
      },
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const owner = row.original.owner;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className={`text-[10px] font-medium `}>
                {owner.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-slate-600">{owner}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "_creationTime",
      header: "Date added",
      cell: ({ row }) => {
        const date = formatDate(row.getValue("_creationTime"));
        if (!date) {
          return <FileBox className="h-4 w-4 text-slate-200" />; // Empty placeholder icon
        }
        return (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4 text-rose-500" />
            <span>{date}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-slate-700">
              {formatSize(row.getValue("size") as number)}
              {/*{((row.getValue("size") as number) / (1024 * 1024)).toFixed(2)}MB*/}
            </span>

            {/* Hover state / Action trigger mimicking the "View Details >" */}
            {/*<div
              className={`flex items-center text-sm text-slate-400 transition-opacity ${row.original.showDetails ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            >
              <span>View Details</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>*/}
          </div>
        );
      },
    },
  ];

  const convexUpload = useMutation(api?.files.addFile);
  const onSubmit = async (data: FieldValues) => {
    try {
      const { name, size, type } = data.file[0];
      console.log({ name, size, type });
      await uploadToCloud(data.file[0]);

      const res = await convexUpload({
        name,
        size,
        type,
        owner: "Adebisi",
      });
      console.log("Upload successful", res);
    } catch (error) {
      console.error(error);
    }
  };
  const table = useReactTable({
    data: filesData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <div className="p-5 text-3xl">
        <h1 className="text-black">Drive</h1>
        <div className="py-10 flex justify-between">
          <Select>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="All files" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/*Dialog component*/}
          <div>
            <Button
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Add File
            </Button>
          </div>
          <DialogComponent isOpen={isOpen} setIsOpen={setIsOpen}>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>Select file to upload</DialogDescription>
            </DialogHeader>
            {/*form  starts*/}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <input
                className=""
                type="file"
                accept="image/*, audio/*, application/pdf"
                {...register("file", { required: true })}
                id="file"
                name="file"
              />

              <Button type="submit">Upload</Button>
            </form>
            {/*form ends*/}
          </DialogComponent>
        </div>
        {/*copied from AI*/}
        <div>
          <div className="rounded-md border border-slate-200 bg-white">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="text-slate-500 font-medium h-12"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="border-slate-100 hover:bg-slate-50/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};
