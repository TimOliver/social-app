import {useCallback} from 'react'
import {ScrollView, View} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'

import {useReadableContentInsets} from '#/lib/hooks/useReadableContentInsets'
import {
  useTrendingSettings,
  useTrendingSettingsApi,
} from '#/state/preferences/trending'
import {useTrendingTopics} from '#/state/queries/trending/useTrendingTopics'
import {useTrendingConfig} from '#/state/service-config'
import {LoadingPlaceholder} from '#/view/com/util/LoadingPlaceholder'
import {BlockDrawerGesture} from '#/view/shell/BlockDrawerGesture'
import {atoms as a, useGutters, useTheme} from '#/alf'
import {transparentifyColor} from '#/alf/util/colorGeneration'
import {Button, ButtonIcon} from '#/components/Button'
import {EdgeToEdgeBleed} from '#/components/EdgeToEdgeBleed'
import {TimesLarge_Stroke2_Corner0_Rounded as X} from '#/components/icons/Times'
import {Trending2_Stroke2_Corner2_Rounded as Graph} from '#/components/icons/Trending'
import * as Prompt from '#/components/Prompt'
import {TrendingTopicLink} from '#/components/TrendingTopics'
import {Text} from '#/components/Typography'
import {useAnalytics} from '#/analytics'

export function TrendingInterstitial() {
  const {enabled} = useTrendingConfig()
  const {trendingDisabled} = useTrendingSettings()
  return enabled && !trendingDisabled ? <Inner /> : null
}

export function Inner() {
  const t = useTheme()
  const {_} = useLingui()
  const ax = useAnalytics()
  const gutters = useGutters([0, 'base', 0, 'base'])
  const trendingPrompt = Prompt.usePromptControl()
  const {setTrendingDisabled} = useTrendingSettingsApi()
  const {data: trending, error, isLoading} = useTrendingTopics()
  const noTopics = !isLoading && !error && !trending?.topics?.length
  const insets = useReadableContentInsets()
  const hasInset = insets.left > 0 || insets.right > 0
  const bgOpaque = t.atoms.bg.backgroundColor
  const bgTransparent = transparentifyColor(bgOpaque, 0)

  const onConfirmHide = useCallback(() => {
    ax.metric('trendingTopics:hide', {context: 'interstitial'})
    setTrendingDisabled(true)
  }, [ax, setTrendingDisabled])

  return error || noTopics ? null : (
    <>
      <EdgeToEdgeBleed />
      <View
        style={
          hasInset && {marginLeft: -insets.left, marginRight: -insets.right}
        }>
        <BlockDrawerGesture>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            contentContainerStyle={
              hasInset && {
                paddingLeft: insets.left,
                paddingRight: insets.right,
              }
            }>
            <View style={[gutters, a.flex_row, a.align_center, a.gap_lg]}>
              <View style={{paddingLeft: 4, paddingRight: 2}}>
                <Graph size="sm" />
              </View>
              {isLoading ? (
                <View style={[a.py_lg, a.flex_row, a.gap_lg, a.align_center]}>
                  <LoadingPlaceholder
                    width={80}
                    height={undefined}
                    style={{alignSelf: 'stretch'}}
                  />
                  <LoadingPlaceholder
                    width={50}
                    height={undefined}
                    style={{alignSelf: 'stretch'}}
                  />
                  <LoadingPlaceholder
                    width={120}
                    height={undefined}
                    style={{alignSelf: 'stretch'}}
                  />
                  <LoadingPlaceholder
                    width={30}
                    height={undefined}
                    style={{alignSelf: 'stretch'}}
                  />
                  <LoadingPlaceholder
                    width={180}
                    height={undefined}
                    style={{alignSelf: 'stretch'}}
                  />
                  <Text
                    style={[
                      t.atoms.text_contrast_medium,
                      a.text_sm,
                      a.font_semi_bold,
                    ]}>
                    {' '}
                  </Text>
                </View>
              ) : !trending?.topics ? null : (
                <>
                  {trending.topics.map(topic => (
                    <TrendingTopicLink
                      key={topic.link}
                      topic={topic}
                      onPress={() => {
                        ax.metric('trendingTopic:click', {
                          context: 'interstitial',
                        })
                      }}>
                      <View style={[a.py_lg]}>
                        <Text
                          style={[
                            t.atoms.text_contrast_medium,
                            a.text_sm,
                            a.font_semi_bold,
                          ]}>
                          {topic.topic}
                        </Text>
                      </View>
                    </TrendingTopicLink>
                  ))}
                  <Button
                    label={_(msg`Hide trending topics`)}
                    size="tiny"
                    variant="ghost"
                    color="secondary"
                    shape="round"
                    onPress={() => trendingPrompt.open()}>
                    <ButtonIcon icon={X} />
                  </Button>
                </>
              )}
            </View>
          </ScrollView>
        </BlockDrawerGesture>
        {hasInset && (
          <>
            <LinearGradient
              pointerEvents="none"
              colors={[bgOpaque, bgOpaque, bgTransparent]}
              locations={[0, 2 / 3, 1]}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={[
                a.absolute,
                {top: 0, bottom: 0, left: 0, width: insets.left},
              ]}
            />
            <LinearGradient
              pointerEvents="none"
              colors={[bgTransparent, bgOpaque, bgOpaque]}
              locations={[0, 1 / 3, 1]}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={[
                a.absolute,
                {top: 0, bottom: 0, right: 0, width: insets.right},
              ]}
            />
          </>
        )}
      </View>
      <EdgeToEdgeBleed />

      <Prompt.Basic
        control={trendingPrompt}
        title={_(msg`Hide trending topics?`)}
        description={_(msg`You can update this later from your settings.`)}
        confirmButtonCta={_(msg`Hide`)}
        onConfirm={onConfirmHide}
      />
    </>
  )
}
