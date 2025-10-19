import Image from "next/image";
import Link from "next/link";

import { BLOG_AUTHORS } from "@/config/blog";

export default async function Author({
  username,
  imageOnly,
}: {
  username: string;
  imageOnly?: boolean;
}) {
  const authors = BLOG_AUTHORS as Record<string, { name: string; image: string; twitter: string }>;
  const author = authors[username];

  if (!author) {
    console.error(`Author "${username}" not found in BLOG_AUTHORS config`);
    return null;
  }

  return imageOnly ? (
    <Image
      src={author.image}
      alt={author.name}
      width={32}
      height={32}
      className="size-8 rounded-full transition-all group-hover:brightness-90"
    />
  ) : (
    <Link
      href={`https://twitter.com/${author.twitter}`}
      className="group flex w-max items-center space-x-2.5"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src={author.image}
        alt={author.name}
        width={40}
        height={40}
        className="size-8 rounded-full transition-all group-hover:brightness-90 md:size-10"
      />
      <div className="flex flex-col -space-y-0.5">
        <p className="font-semibold text-foreground max-md:text-sm">
          {author.name}
        </p>
        <p className="text-sm text-muted-foreground">@{author.twitter}</p>
      </div>
    </Link>
  );
}
