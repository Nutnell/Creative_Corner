import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Eye } from "lucide-react"

export function BlogCard({ post }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {post.image && (
        <div className="aspect-video relative overflow-hidden">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary">
          <Link href={`/post/${post._id}`}>{post.title}</Link>
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3">{post.summary}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
            <AvatarFallback>{post.author.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {post.likes}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post.comments}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.views}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/post/${post._id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
