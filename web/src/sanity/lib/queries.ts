import { defineQuery } from "next-sanity";

// Get all posts (excluding About page)
export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current) && slug.current != "about"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  categories[]->{title}
}`);

// Get latest 3 posts (excluding About page)
export const LATEST_POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current) && slug.current != "about"] | order(publishedAt desc)[0...3] {
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  categories[]->{title}
}`);

export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  mainImage,
  body,
  author->{name, image, bio},
  categories[]->{title}
}`);

export const LINKS_QUERY = defineQuery(`*[_type == "link"] | order(publishedAt desc) {
  _id,
  url,
  title,
  description,
  image,
  publishedAt
}`);

export const LATEST_LINKS_QUERY = defineQuery(`*[_type == "link"] | order(publishedAt desc)[0...4] {
  _id,
  url,
  title,
  description,
  image,
  publishedAt
}`);

export const CATEGORIES_QUERY = defineQuery(`*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug
}`);
