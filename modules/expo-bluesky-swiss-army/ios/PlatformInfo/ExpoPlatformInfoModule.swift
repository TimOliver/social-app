import ExpoModulesCore

public class ExpoPlatformInfoModule: Module {
  private var prevAudioActive: Bool?
  private var prevAudioCategory: AVAudioSession.Category?

  public func definition() -> ModuleDefinition {
    Name("ExpoPlatformInfo")

    Function("getIsReducedMotionEnabled") {
      return UIAccessibility.isReduceMotionEnabled
    }

    // Returns horizontal insets that account for iPadOS 26 windowed-mode
    // window controls (the traffic-light buttons), which the safe area
    // does NOT include. Falls back to zeros on older iOS / non-iPadOS.
    Function("getCornerAdaptedMargins") { () -> [String: Double] in
      let zero: [String: Double] = ["left": 0.0, "right": 0.0]
      if #available(iOS 26.0, *) {
        return DispatchQueue.main.sync { () -> [String: Double] in
          guard let scene = UIApplication.shared.connectedScenes.first(where: {
                  $0.activationState == .foregroundActive
                }) as? UIWindowScene,
                let window = scene.windows.first(where: { $0.isKeyWindow })
          else {
            return zero
          }
          let insets = window.edgeInsets(
            for: .margins(cornerAdaptation: .horizontal)
          )
          return [
            "left": Double(insets.left),
            "right": Double(insets.right),
          ]
        }
      }
      return zero
    }

    Function("setAudioCategory") { (audioCategoryString: String) in
      let audioCategory = AVAudioSession.Category(rawValue: audioCategoryString)
      if audioCategory == self.prevAudioCategory {
        return
      }
      self.prevAudioCategory = audioCategory
      DispatchQueue.global(qos: .background).async {
        try? AVAudioSession.sharedInstance().setCategory(audioCategory)
      }
    }

    Function("setAudioActive") { (active: Bool) in
      if active == self.prevAudioActive {
        return
      }
      self.prevAudioActive = active
      if active {
        DispatchQueue.global(qos: .background).async {
          try? AVAudioSession.sharedInstance().setActive(true)
        }
      } else {
        DispatchQueue.global(qos: .background).async {
          try? AVAudioSession
            .sharedInstance()
            .setActive(
              false,
              options: [.notifyOthersOnDeactivation]
            )
        }
      }
    }
  }
}
