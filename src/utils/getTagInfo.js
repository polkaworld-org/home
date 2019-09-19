import jsyaml from 'js-yaml';

export default function getTagInfo(obj) {
  if (typeof obj !== 'object') {
    return {};
  } else {
    const result = jsyaml.load(obj.description);
    return typeof result === 'object' ? result : {};
  }
}
