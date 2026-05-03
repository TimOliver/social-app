import {ScrollView, StyleSheet, View} from 'react-native'

import {useIsKeyboardVisible} from '#/lib/hooks/useIsKeyboardVisible'
import {useWebMediaQueries} from '#/lib/hooks/useWebMediaQueries'
import {atoms as a, useTheme, web} from '#/alf'
import {Text} from '#/components/Typography'
import {IS_IPAD} from '#/env'

export const LoggedOutLayout = ({
  leadin,
  title,
  description,
  children,
  scrollable,
}: React.PropsWithChildren<{
  leadin: string
  title: string
  description: string
  scrollable?: boolean
}>) => {
  const t = useTheme()
  const {isMobile, isTabletOrMobile} = useWebMediaQueries()
  const [isKeyboardVisible] = useIsKeyboardVisible()
  // The side panel reads as part of the page in light mode (its lighter
  // background contrasts with the white content), but in dark mode both
  // panels are dark, so add a separator border to keep them distinct.
  const darkBorder = t.name === 'dark' && [
    t.atoms.border_contrast_low,
    {borderLeftWidth: 1},
  ]

  if (isMobile || IS_IPAD) {
    if (scrollable) {
      return (
        <ScrollView
          style={a.flex_1}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          contentContainerStyle={[
            {paddingBottom: isKeyboardVisible ? 300 : 0},
          ]}>
          <View style={a.pt_lg}>{children}</View>
        </ScrollView>
      )
    } else {
      return <View style={a.pt_lg}>{children}</View>
    }
  }
  return (
    <View style={styles.container}>
      <View style={[styles.side, t.atoms.bg_contrast_25]}>
        <Text
          style={[
            t.atoms.text_contrast_medium,
            styles.leadinText,
            isTabletOrMobile && styles.leadinTextSmall,
          ]}>
          {leadin}
        </Text>
        <Text
          style={[
            {color: t.palette.primary_500},
            styles.titleText,
            isTabletOrMobile && styles.titleTextSmall,
          ]}>
          {title}
        </Text>
        <Text
          style={[
            a.text_2xl,
            a.font_medium,
            t.atoms.text_contrast_medium,
            styles.descriptionText,
          ]}>
          {description}
        </Text>
      </View>
      {scrollable ? (
        <View style={[styles.scrollableContent, t.atoms.bg, darkBorder]}>
          <ScrollView
            style={a.flex_1}
            contentContainerStyle={styles.scrollViewContentContainer}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag">
            <View style={[styles.contentWrapper, web(a.my_auto)]}>
              {children}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={[styles.content, t.atoms.bg, darkBorder]}>
          <View style={styles.contentWrapper}>{children}</View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // @ts-ignore web only
    height: '100vh',
  },
  side: {
    flex: 1,
    paddingHorizontal: 40,
    paddingBottom: 80,
    justifyContent: 'center',
  },
  content: {
    flex: 2,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  scrollableContent: {
    flex: 2,
  },
  scrollViewContentContainer: {
    flex: 1,
    paddingHorizontal: 40,
  },
  leadinText: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'right',
  },
  leadinTextSmall: {
    fontSize: 24,
  },
  titleText: {
    fontSize: 58,
    fontWeight: '800',
    textAlign: 'right',
  },
  titleTextSmall: {
    fontSize: 36,
  },
  descriptionText: {
    maxWidth: 400,
    marginTop: 10,
    marginLeft: 'auto',
    textAlign: 'right',
  },
  contentWrapper: {
    maxWidth: 600,
  },
})
