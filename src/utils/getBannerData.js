import getExtraData from './getExtraData';

export default function getBannerData(allPosts) {
  const posts = allPosts.filter(({ node }) => node.featured);
  const result = [];

  for (const index of [1, 2, 3, 4]) {
    const post = posts.find(({ node }) => {
      const { position } = getExtraData(node) || {};
      return position === index;
    });
    if (post) {
      result.push(post);
    }
  }

  return result;
}
