const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.saulnative.StickerSmash.dev";
  }

  if (IS_PREVIEW) {
    return "com.saulnative.StickerSmash.preview";
  }

  return "com.saulnative.StickerSmash";
};

const getAppName = () => {
  if (IS_DEV) {
    return "StickerSmash (Dev)";
  }

  if (IS_PREVIEW) {
    return "StickerSmash (Preview)";
  }

  return "StickerSmash: Emoji Stickers";
};

export default {
  expo: {
    name: getAppName(),
    slug: "StickerSmash",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#25292e",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: getUniqueIdentifier(),
      googleServicesFile: "./google-services.json",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "28239345-9495-481a-aa07-a58bbbe76253",
      },
    },
    owner: "saulnative",
    plugins: [
      [
        "expo-notifications",
        {
          icon: "./assets/icon.png",
          color: "#ffffff",
          defaultChannel: "default",
          // sounds: [
          //   "./local/assets/notification-sound.wav",
          //   "./local/assets/notification-sound-other.wav",
          // ],
        },
      ],
    ],
  },
};
