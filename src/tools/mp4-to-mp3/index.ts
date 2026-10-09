import type { ToolModule } from "../types";
import Tool from "./Tool";

export const tool: ToolModule = {
  config: {
    id: "mp4-to-mp3",
    category: "converters",
    glyph: "MP3",
    slugs: { en: "mp4-to-mp3" },
    texts: {
      en: {
        name: "MP4 to MP3",
        title: "MP4 to MP3 Converter: Extract Audio From Video Online",
        metaDescription:
          "Extract the audio track from an MP4 or WebM video and save it as an MP3 file. Choose the bitrate and download. Converted in your browser, nothing is uploaded.",
        h1: "MP4 to MP3 Converter",
        tagline: "Pull the sound out of a video and save it as an MP3, on your own device.",
      },
    },
    keywords: ["mp4 to mp3", "video to mp3", "extract audio", "webm to mp3", "audio extractor", "convert video to audio", "mp3 converter", "rip audio", "youtube to mp3", "music from video"],
    related: ["length-converter", "weight-converter", "image-compressor"],
    flags: { new: true, recommended: true },
    updated: "2026-10-09",
  },
  content: {
    en: {
      intro: [
        "Sometimes you only need the sound of a video: a lecture to listen to on the move, a song from a clip you recorded, a voice memo or an interview. This tool extracts the audio track from an MP4 or WebM video and saves it as an MP3 file that plays on practically any device.",
        "The conversion happens in your browser. The video is never uploaded, which keeps private recordings private and means there is no waiting for an upload. Choose a bitrate, press Convert and download the result when it finishes.",
      ],
      howTo: [
        "Drop an MP4 or WebM video onto the box, or choose one from your device.",
        "Pick an MP3 quality. 128 kbps is fine for speech, 192 kbps is a good default for music and 320 kbps is the highest.",
        "Press Convert to MP3 and wait. A progress bar shows how far along it is.",
        "Listen to the preview, then download the MP3 file.",
      ],
      howItWorks: {
        paragraphs: [
          "The browser first decodes the video's audio track into raw sound samples using its built-in Web Audio engine. The tool then compresses those samples with a small MP3 encoder library that runs on your device, in short blocks so the page stays responsive. The encoder library is only downloaded when you press Convert.",
          "MP3 is a lossy format. The bitrate sets how many kilobits of data are used per second of sound: a higher bitrate means a larger file and a closer match to the original. A rough size is the duration in seconds multiplied by the bitrate and divided by 8. At 192 kbps one minute of audio takes about 1.4 megabytes.",
          "The sound is decoded as the browser hears it, so the conversion works only for audio formats your browser can play, such as AAC in an MP4 or Opus and Vorbis in a WebM. Stereo stays stereo and mono stays mono. Very long or very large videos need a lot of memory, so the tool declines files above 500 megabytes. Videos without a sound track cannot be converted.",
        ],
        formula: "file size (bytes) ≈ seconds × bitrate (kbps) × 1000 ÷ 8\n1 minute at 192 kbps ≈ 1.4 MB",
      },
      examples: [
        { title: "A recorded lecture", body: "Convert a one-hour lecture at 128 kbps to get an MP3 of about 58 megabytes that is easy to listen to on the move." },
        { title: "A song from a video you filmed", body: "Use 192 or 256 kbps to keep the music sounding good, and download the MP3 to play it on any device." },
        { title: "A voice message saved as video", body: "Extract it at 96 or 128 kbps. Speech sounds clear at these settings and the file stays small." },
      ],
      useCases: [
        "Listening to lectures, interviews, podcasts and webinars without the video.",
        "Saving the audio of your own recordings, concerts and family videos.",
        "Creating small audio files that are easier to share than a full video.",
        "Preparing audio for editing or transcription software that does not accept video.",
      ],
      tips: [
        "Only convert videos you have the right to use. Copyright applies to the audio of other people's videos.",
        "If conversion fails, try a current version of Chrome, Edge or Firefox. Some videos use audio formats that a browser cannot play.",
      ],
      faqs: [
        { q: "Is my video uploaded anywhere?", a: "No. The audio is decoded and encoded on your device. The video file never reaches our servers." },
        { q: "Which bitrate should I choose?", a: "Use 128 kbps for speech, 192 kbps as a general default and 256 to 320 kbps for music you care about. Higher means a bigger file. A low-quality source will not sound better at a higher bitrate." },
        { q: "Why did the conversion fail?", a: "The most common reasons are a video without audio, an audio format the browser cannot decode, or a file too large for your device's memory. Try another browser, or a smaller file." },
        { q: "Is there a size limit?", a: "The tool refuses files over 500 MB, because the browser has to hold the decoded sound in memory. Long recordings take correspondingly longer to convert." },
        { q: "Can I convert videos from YouTube?", a: "This tool only works with video files you already have on your device. It does not download videos from websites." },
      ],
    },
  },
  Tool,
};
