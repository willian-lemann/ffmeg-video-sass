import { ChangeEvent } from "react";

type UploadVideoProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function UploadVideo({ onChange }: UploadVideoProps) {
  return (
    <div className="w-full border-dashed border-gray-300 border rounded-lg p-6 transition-colors flex flex-col items-center justify-center">
      <label
        htmlFor="video-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        <UploadIcon className="w-10 h-10 text-gray-500 hover:text-gray-700 transition-colors" />
        <span className="text-sm text-gray-500 mt-3 text-center">
          <input
            hidden
            type="file"
            id="video-upload"
            accept="video/mp4"
            onChange={onChange}
          />
          <span className="font-medium pr-1 underline cursor-pointer hover:text-gray-900 transition-colors">
            Choose a file
          </span>
          or drag and drop
        </span>
      </label>
    </div>
  );
}

function UploadIcon(
  props: React.SVGProps<SVGSVGElement> & { className?: string }
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
