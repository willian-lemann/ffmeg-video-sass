import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { UploadVideo } from "src/components/upload-video";
import { Timeline } from "src/components/timeline";

const ffmpeg = new FFmpeg();

function App() {
  const [ready, setReady] = useState(false);

  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [timelineVideos, setTimelineVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFFmpeg = useCallback(async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
    setReady(true);
  }, []);

  const handleChangeVideo = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    splitVideoInChunks(file);
  }, []);

  const splitVideoInChunks = async (video: File) => {
    console.log("splited again");
    try {
      if (!video) return;
      setIsLoading(true);

      const inputPath = video.name;
      const outputPath = `temp/output%03d.mp4`;

      const segmentDurationSeconds = Math.ceil(8 / 1000); // Duration of each segment in seconds

      const file = await fetchFile(video);
      await ffmpeg.createDir("temp");
      await ffmpeg.writeFile(inputPath, file);

      const command =
        `-i ${inputPath} -c copy -map 0 -segment_time ${segmentDurationSeconds} -f segment -reset_timestamps 1 ${outputPath}`.split(
          " "
        );

      await ffmpeg.exec(command);

      setIsLoading(false);

      const files = await ffmpeg.listDir("temp");

      console.log(files);
      const chunkFiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.isDir) {
          chunkFiles.push(ffmpeg.readFile(`temp/${file.name}`));
        }
      }

      const results = await Promise.all(chunkFiles);

      const listOfVideos: string[] = [];
      for (let i = 0; i < results.length; i++) {
        const buffer = results[i];
        const videoURL = URL.createObjectURL(
          new Blob([buffer], { type: "video/mp4" })
        );
        listOfVideos.push(videoURL);
      }

      setTimelineVideos(listOfVideos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadFFmpeg();
  }, []);

  if (!ready) return <div>Loading...</div>;

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="space-y-4  max-w-[450px] w-[450px]">
          {video ? (
            <div className="max-w-[450px] w-[450px]">
              <video
                controls
                width={450}
                className="object-contain rounded-md"
                src={videoPreview}
              ></video>
            </div>
          ) : null}

          <Timeline chunks={timelineVideos} />

          <UploadVideo onChange={handleChangeVideo} />
        </div>
      </div>
    </div>
  );
}

export default App;
