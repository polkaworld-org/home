import getExtraData from './getExtraData';
import getForumUrl from './getForumUrl';

export default function getCommunityData(post) {
  const { forum_uri } = getExtraData(post) || {};
  if (forum_uri && post.tags.find(({ slug }) => slug === 'community')) {
    return {
      forum_url: getForumUrl(forum_uri),
    };
  }
  return null;
}
