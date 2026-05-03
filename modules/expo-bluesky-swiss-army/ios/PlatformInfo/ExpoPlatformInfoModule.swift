import ExpoModulesCore

public class ExpoPlatformInfoModule: Module {
  private var prevAudioActive: Bool?
  private var prevAudioCategory: AVAudioSession.Category?

  public func definition() -> ModuleDefinition {
    Name("ExpoPlatformInfo")

    Function("getIsReducedMotionEnabled") {
      return UIAccessibility.isReduceMotionEnabled
    }

    // Returns the horizontal/vertical insets that UIView's readableContentGuide
    // would apply to a full-screen view at the current screen size and Dynamic
    // Type setting. On iPhone these are typically the layout margins (~16pt);
    // on iPad they are wider, capping content to a comfortable reading width.
    Function("getReadableContentInsets") { () -> [String: Double] in
      DispatchQueue.main.sync {
        guard let scene = UIApplication.shared.connectedScenes.first(where: {
                $0.activationState == .foregroundActive
              }) as? UIWindowScene,
              let window = scene.windows.first(where: { $0.isKeyWindow }),
              let rootView = window.rootViewController?.view else {
          return ["left": 0.0, "right": 0.0, "top": 0.0, "bottom": 0.0]
        }
        rootView.layoutIfNeeded()
        let bounds = rootView.bounds
        let frame = rootView.readableContentGuide.layoutFrame
        return [
          "left": Double(frame.minX),
          "right": Double(bounds.width - frame.maxX),
          "top": Double(frame.minY),
          "bottom": Double(bounds.height - frame.maxY),
        ]
      }
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
