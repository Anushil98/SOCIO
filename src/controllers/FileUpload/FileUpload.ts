import { spawn } from "child_process";
import { Request, Response } from "express";
import ffmpeg from "ffmpeg-ffprobe-static";
import { fromBuffer } from "file-type";
// eslint-disable-next-line import/no-named-default
import { default as Fffmpeg } from "fluent-ffmpeg";
import fs from "fs";
import { toInteger } from "lodash";
import sharp from "sharp";
import { uuid } from "uuidv4";
import { logger } from "../../utils/pino.utils";

Fffmpeg.setFfmpegPath(ffmpeg.ffmpegPath);
Fffmpeg.setFfprobePath(ffmpeg.ffprobePath);

const getVideoDimensions = (extension: any, filename: string): Promise<{ height: number; width: number }> => {
  return new Promise((resolve, reject) => {
    console.log(`${__dirname}/video/${filename}.${extension.ext}`);
    Fffmpeg(`${__dirname}/video/${filename}.${extension.ext}`).ffprobe(0, (err, data) => {
      console.log(err, data, "testing");
      if (err) {
        reject(err);
      }
      const { height, width } = data.streams[0];

      resolve({ height, width });
    });
  });
};

export const uploadMiddleware = async (req: Request, resp: Response) => {
  try {
    const { files } = req;
    // const { body } = req;
    console.log(files, "slkjlk");

    const theFiles:
      | {
          [fieldname: string]: Express.Multer.File[];
        }
      | Express.Multer.File[] = files;
    const filenames = Array((theFiles as any[]).length);
    // const { meta } = body;
    await Promise.all(
      (theFiles as any[]).map(
        async (obj, index): Promise<void> => {
          const uploadfilename = `${uuid()}`;
          const BigBuffer = obj.buffer;
          filenames[index] = {};

          const extension = await fromBuffer(BigBuffer);
          if (extension === undefined) {
            throw new Error("File Not Supported");
          }
          if (extension.mime.includes("image")) {
            let MainBuffer;
            const metadata = await sharp(BigBuffer).metadata();
            const { height, width } = metadata;
            if (extension.mime !== "image/jpeg") {
              MainBuffer = await sharp(BigBuffer)
                .jpeg()
                .resize(width, height, { fit: "outside" })
                .toBuffer();
            }
            MainBuffer = await sharp(BigBuffer)
              .resize(width, height, { fit: "outside" })
              .toBuffer();
            filenames[index] = {
              ...filenames[index],
              height,
              width
            };

            const HighRes = MainBuffer;
            try {
              fs.writeFileSync(`${__dirname}/../../../public/files/HighRes/${uploadfilename}.jpeg`, HighRes);
            } catch (err) {
              logger.error(err);
              return null;
            }
            const MainBufferLowres = await sharp(MainBuffer)
              .resize(400, toInteger((height / width) * 400), { fit: "outside" })
              .toBuffer();
            const LowRes = MainBufferLowres;
            try {
              fs.writeFileSync(`${__dirname}/../../../public/files/LowRes/${uploadfilename}.jpeg`, LowRes);
            } catch (err) {
              logger.error(err);
              return null;
            }
            const MainBufferLowestres = await sharp(MainBuffer)
              .resize(150, toInteger((height / width) * 150), { fit: "outside" })
              .toBuffer();
            const LowestRes = MainBufferLowestres;
            try {
              fs.writeFileSync(`${__dirname}/../../../public/files/LowestRes/${uploadfilename}.jpeg`, LowestRes);
            } catch (err) {
              logger.error(err);
              return null;
            }
          } else if (extension.mime.includes("application")) {
            try {
              try {
                fs.writeFileSync(`${__dirname}/../../../public/files/application/${uploadfilename}.${extension.ext}`, BigBuffer);
              } catch (err) {
                logger.error(err);
                return null;
              }

              try {
                fs.writeFileSync(`${__dirname}/../../../public/pdf/${uploadfilename}.${extension.ext}`, BigBuffer);

                const getThumbBuffer = (filename: string): Promise<any> => {
                  return new Promise((resolve, reject) => {
                    const child = spawn("/usr/bin/python3", [`${__dirname}/pdftothumb.py`, filename]);
                    child.stdout.setEncoding("utf8");
                    child.stdout.on("data", chunk => {
                      logger.debug(chunk);
                    });
                    child.stderr.on("data", chunk => {
                      logger.error(chunk.toString());
                      reject(new Error("Thumbnail Creation Failed"));
                    });
                    child.on("close", async code => {
                      logger.debug(`child process exited with code ${code}`);
                      const tempBuffer = [];
                      const output = fs.createReadStream(`${__dirname}/thumbnail/${filename}.png`);
                      const ThumbBuffer: Buffer = await new Promise(res => {
                        output
                          .on("data", chunk => {
                            tempBuffer.push(chunk);
                          })
                          .on("end", () => {
                            res(Buffer.concat(tempBuffer));
                          })
                          .on("error", err => {
                            console.log(err);
                          });
                      });
                      resolve(ThumbBuffer);
                    });
                  });
                };

                // Create Thumbnail For Image
                const thumbbuffer = await getThumbBuffer(uploadfilename);
                try {
                  fs.writeFileSync(`${__dirname}/../../../public/files/Thumbnail/${uploadfilename}.pbg`, thumbbuffer);

                  fs.unlinkSync(`${__dirname}/pdf/${uploadfilename}.${extension.ext}`);
                  fs.unlinkSync(`${__dirname}/thumbnail/${uploadfilename}.png`);
                } catch (err) {
                  logger.error(err);
                  fs.unlinkSync(`${__dirname}/pdf/${uploadfilename}.${extension.ext}`);
                  fs.unlinkSync(`${__dirname}/thumbnail/${uploadfilename}.png`);
                }
              } catch (err) {
                console.log(err);
                fs.unlinkSync(`${__dirname}/pdf/${uploadfilename}.${extension.ext}`);
                fs.unlinkSync(`${__dirname}/thumbnail/${uploadfilename}.png`);
              }
            } catch (Err) {
              logger.error(Err);
            }
          } else if (extension.mime.includes("video")) {
            try {
              fs.writeFileSync(`${__dirname}/../../../public/video/${uploadfilename}.${extension.ext}`, BigBuffer);
              console.log("Video Saved");
              const dimensions = await getVideoDimensions(extension, uploadfilename);
              console.log("Dimensions  Saved");

              Fffmpeg(`${__dirname}/video/${uploadfilename}.${extension.ext}`).screenshots({
                timestamps: ["0%"],
                filename: `${uploadfilename}.jpeg`,
                folder: `${__dirname}/thumbnail`,
                size: `${dimensions.width}x${dimensions.height}`
              });
              console.log("Thumbnail  Generated");
              try {
                fs.writeFileSync(`${__dirname}/../../../public/files/Video/${uploadfilename}.${extension.ext}`, BigBuffer);
              } catch (err) {
                logger.error(err);
              }
              const tempBuffer = [];
              const output = fs.createReadStream(`${__dirname}/thumbnail/${uploadfilename}.jpeg`);
              console.log("Thumnail Extracted");
              const ThumbBuffer: Buffer = await new Promise(res => {
                output
                  .on("data", chunk => {
                    tempBuffer.push(chunk);
                  })
                  .on("end", () => {
                    res(Buffer.concat(tempBuffer));
                  })
                  .on("error", err => {
                    logger.error(err);
                  });
              });
              try {
                fs.writeFileSync(`${__dirname}/../../../public/files/Thumbnail/${uploadfilename}.jpeg`, ThumbBuffer);
                fs.unlinkSync(`${__dirname}/video/${uploadfilename}.${extension.ext}`);
                fs.unlinkSync(`${__dirname}/thumbnail/${uploadfilename}.jpeg`);
              } catch (err) {
                logger.error(err);
              }
            } catch (err) {
              logger.error(err);
              fs.unlinkSync(`${__dirname}/video/${uploadfilename}.${extension.ext}`);
              fs.unlinkSync(`${__dirname}/thumbnail/${uploadfilename}.jpeg`);
            }
          } else throw new Error("Wrong Format File");
          filenames[index] = {
            ...filenames[index],
            uploadfilename: JSON.stringify({ filename: uploadfilename, MIME: extension.mime })
          };
        }
      )
    );

    resp.send(filenames).status(200);
  } catch (err) {
    logger.error(err);
    resp.status(404).send("File Not Supported");
  }
};
