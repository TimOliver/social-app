import {View} from 'react-native'
import {AppBskyEmbedVideo} from '@atproto/api'

import {type FeedPostSliceItem} from '#/state/queries/post-feed'
import {type VideoFeedSourceContext} from '#/screens/VideoFeed/types'
import {atoms as a, useBreakpoints, useGutters} from '#/alf'
import * as Grid from '#/components/Grid'
import {
  VideoPostCard,
  VideoPostCardPlaceholder,
} from '#/components/VideoPostCard'
import {useAnalytics} from '#/analytics'
import {IS_IPAD} from '#/env'

export function PostFeedVideoGridRow({
  items: slices,
  sourceContext,
}: {
  items: FeedPostSliceItem[]
  sourceContext: VideoFeedSourceContext
}) {
  const ax = useAnalytics()
  const gutters = useGutters(['base', 'base', 0, 'base'])
  const posts = slices
    .filter(slice => AppBskyEmbedVideo.isView(slice.post.embed))
    .map(slice => ({
      post: slice.post,
      moderation: slice.moderation,
    }))

  /**
   * This should not happen because we should be filtering out posts without
   * videos within the `PostFeed` component.
   */
  if (posts.length !== slices.length) return null

  // Match PostFeed's batching: 3 cols on iPad / wide screens, 2 otherwise.
  const colWidth = posts.length >= 3 ? 1 / 3 : 1 / 2

  return (
    <View style={[gutters]}>
      <View style={[a.flex_row, a.gap_sm]}>
        <Grid.Row gap={a.gap_sm.gap}>
          {posts.map(post => (
            <Grid.Col key={post.post.uri} width={colWidth}>
              <VideoPostCard
                post={post.post}
                sourceContext={sourceContext}
                moderation={post.moderation}
                onInteract={() => {
                  ax.metric('videoCard:click', {context: 'feed'})
                }}
              />
            </Grid.Col>
          ))}
        </Grid.Row>
      </View>
    </View>
  )
}

export function PostFeedVideoGridRowPlaceholder() {
  const gutters = useGutters(['base', 'base', 0, 'base'])
  const {gtMobile} = useBreakpoints()
  const cols = IS_IPAD || gtMobile ? 3 : 2
  return (
    <View style={[gutters]}>
      <View style={[a.flex_row, a.gap_sm]}>
        {Array.from({length: cols}).map((_, i) => (
          <VideoPostCardPlaceholder key={i} />
        ))}
      </View>
    </View>
  )
}
