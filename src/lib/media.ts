export function isVideo(src: string): boolean {
  return /\.(mp4|webm)(\?|$)/i.test(src);
}
