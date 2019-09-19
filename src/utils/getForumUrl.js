export default function getForumUrl(uri) {
  try {
    return new URL(uri, 'https://forum.polkaworld.org').href;
  } catch {
    return '';
  }
}
