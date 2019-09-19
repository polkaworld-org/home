import jsyaml from 'js-yaml';

export default function getExtraData(obj) {
  if (typeof obj !== 'object') {
    return {};
  } else {
    const result = jsyaml.load(obj.codeinjection_head);
    return typeof result === 'object' ? result : {};
  }
}
