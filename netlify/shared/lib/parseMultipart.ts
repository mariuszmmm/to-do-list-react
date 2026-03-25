import { HandlerEvent } from "@netlify/functions";
import Busboy from "busboy";

export type MultipartResult = {
  fileBuffer: Buffer;
  filename: string;
  mimeType: string;
  fields: Record<string, string>;
};

export const parseMultipart = (
  event: HandlerEvent
): Promise<MultipartResult> => {
  return new Promise((resolve, reject) => {
    if (!event.body) {
      reject(new Error("Missing request body"));
      return;
    }

    const contentType =
      event.headers["content-type"] || event.headers["Content-Type"];

    if (!contentType?.includes("multipart/form-data")) {
      reject(new Error(`Unsupported content type: ${contentType}`));
      return;
    }

    const busboy = Busboy({
      headers: {
        "content-type": contentType,
      },
    });
    const chunks: Buffer[] = [];
    const fields: Record<string, string> = {};

    let filename = "";
    let mimeType = "";

    busboy.on("file", (_fieldname, file, info) => {
      filename = info.filename;
      mimeType = info.mimeType;

      file.on("data", (data: Buffer) => chunks.push(data));
      file.on("end", () => {
        /* noop */
      });
    });

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("error", reject);

    busboy.on("finish", () => {
      if (!chunks.length) {
        reject(new Error("No file uploaded"));
        return;
      }

      resolve({
        fileBuffer: Buffer.concat(chunks),
        filename,
        mimeType,
        fields,
      });
    });

    busboy.end(Buffer.from(event.body, "base64"));
  });
};
