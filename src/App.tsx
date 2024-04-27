import { ChangeEvent, useEffect, useState } from "react";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { UploadVideo } from "./components/upload-video";

const ffmpeg = new FFmpeg();

function App() {
  const [ready, setReady] = useState(false);

  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [timelineVideos, setTimelineVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("render");
  async function loadFFmpeg() {
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
  }

  function handleChangeVideo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.item(0);
    if (!file) return;
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    splitVideoInChunks(file);
  }

  const splitVideoInChunks = async (video: File) => {
    try {
      if (!video) return;
      setIsLoading(true);

      const inputPath = video.name;
      const outputPath = `temp/output%03d.mp4`;
      const segmentDurationSeconds = "00:00:02"; // Duration of each segment in seconds

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
        <div className="space-y-4">
          {video ? (
            <div className="space-y-2">
              <video
                className="bg-black rounded-md h-[300px] w-[600px]"
                width={600}
                src={videoPreview}
              ></video>

              <div className="flex items-center w-fit rounded-md overflow-hidden bg-black">
                {timelineVideos.map((video) => (
                  <video
                    key={video}
                    className="h-12 w-full object-contain"
                    width={350}
                    src={video}
                  ></video>
                ))}
              </div>
            </div>
          ) : null}

          {isLoading ? <p>loading video...</p> : null}

          <UploadVideo onChange={handleChangeVideo} />
        </div>
      </div>
    </div>
  );
}

export default App;
